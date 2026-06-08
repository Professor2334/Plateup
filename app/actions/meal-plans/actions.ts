'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { generateMealPlan as deepSeekGenerate } from '@/lib/deepseek';
import { MealPlanGenerationSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';

export async function generateMealPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const budget = parseFloat(formData.get('budget') as string);
  const ingredients = formData.get('ingredients') as string;

  const validatedFields = MealPlanGenerationSchema.safeParse({ budget, ingredients });

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid input data.' };
  }

  const householdSize = (session.user as any).householdSize || '3-4';
  const primaryGoal = (session.user as any).primaryGoal || 'save-money';

  try {
    const mealPlan = await deepSeekGenerate(budget, ingredients, householdSize, primaryGoal);
    return { success: true, data: mealPlan };
  } catch (error) {
    console.error('Meal Plan Generation Error:', error);
    return { success: false, error: 'Failed to generate meal plan. Please try again.' };
  }
}

export async function saveMealPlan(budget: number, ingredients: string, generatedPlan: any, shoppingList: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const newPlan = await db.mealPlan.create({
      data: {
        userId: session.user.id,
        budget,
        ingredients,
        generatedPlan,
        shoppingList,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, id: newPlan.id };
  } catch (error) {
    console.error('Save Meal Plan Error:', error);
    return { success: false, error: 'Failed to save meal plan.' };
  }
}

export async function getMealHistory() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const history = await db.mealPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return history;
  } catch (error) {
    console.error('Fetch Meal History Error:', error);
    return [];
  }
}

export async function deleteMealPlan(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const plan = await db.mealPlan.findUnique({ where: { id } });
    if (!plan || plan.userId !== session.user.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }

    await db.mealPlan.delete({ where: { id } });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete Meal Plan Error:', error);
    return { success: false, error: 'Failed to delete meal plan.' };
  }
}
