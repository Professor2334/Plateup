import { generateMealPlan } from '../app/actions/meal-plans/actions';

async function run() {
  const formData = new FormData();
  formData.append('budget', '15000');
  formData.append('ingredients', 'Rice, Beans, Palm Oil, Salt');
  formData.append('budgetFriendly', 'false');

  // Need to mock auth session... 
  // Actually it's a server action, it imports `auth()` which expects next-auth context.
  console.log("Mocking might be hard outside next environment.");
}

run();
