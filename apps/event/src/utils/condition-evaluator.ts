import { Injectable } from '@nestjs/common';

export type ComparisonOperator = '>=' | '<=' | '>' | '<' | '==' | '!=';

export type Condition =
  | {
      type: 'comparison';
      field: string;
      operator: ComparisonOperator;
      value: number | string;
    }
  | {
      type: 'achievement';
      achievementId: string;
    };

@Injectable()
export class ConditionEvaluator {
  evaluate(conditions: Condition[], user: Record<string, any>): boolean {
    for (const cond of conditions) {
      if (cond.type === 'comparison') {
        const actual = user[cond.field];
        const expected = cond.value;
        switch (cond.operator) {
          case '>=':
            if (!(actual >= expected)) return false;
            break;
          case '<=':
            if (!(actual <= expected)) return false;
            break;
          case '>':
            if (!(actual > expected)) return false;
            break;
          case '<':
            if (!(actual < expected)) return false;
            break;
          case '==':
            if (!(actual == expected)) return false;
            break;
          case '!=':
            if (!(actual != expected)) return false;
            break;
        }
      }
      if (cond.type === 'achievement') {
        if (!user.achievements?.includes(cond.achievementId)) {
          return false;
        }
      }
    }
    return true;
  }
}
