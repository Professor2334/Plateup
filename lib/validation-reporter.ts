export type ValidationLog = {
  name: string;
  passed: boolean;
  reason?: string;
  action?: string;
};

export class ValidationReporter {
  private logs: ValidationLog[] = [];

  logPass(name: string, details?: string) {
    this.logs.push({ name, passed: true, reason: details });
  }

  logFail(name: string, reason: string, action: string) {
    this.logs.push({ name, passed: false, reason, action });
  }

  printFinal(status: 'APPROVED' | 'REJECTED') {
    // Validation output to terminal disabled per user request
    // The validation logic still runs in the backend
  }
}
