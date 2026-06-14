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
    console.log('\nValidation Report\n');

    this.logs.forEach(log => {
      if (log.passed) {
        console.log(`✓ ${log.name} Passed\n`);
        if (log.reason) {
          console.log(`${log.reason}\n`);
        }
      } else {
        console.log(`✗ ${log.name} Failed\n`);
        console.log(`Reason:\n${log.reason}\n`);
        console.log(`Action:\n${log.action}\n`);
      }
    });

    console.log(`Final Status:\n${status}\n--------------------------------------------------\n`);
  }
}
