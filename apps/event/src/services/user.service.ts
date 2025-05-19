import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  // 실제 시스템에서는 DB나 외부 API로 대체될 수 있음
  async getUserInfo(userId: string): Promise<Record<string, any>> {
    // Mock user info
    return {
      userId,
      level: 290,
      achievements: [
        'EXTREME_KALLOS_CLEAR',
        'DAILY_LOGIN_365',
        'PUNCHKING_TOP10_LARA',
      ],
    };
  }
}
