import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  /** 
   * 실제 시스템에서는 DB나 외부 API로 대체될 수 있음
   * 아마 외부 시스템을 호출하는 형태로 구현 할 것 같음 (실제 게임 db)
   * 보상 지급과 같은 경우에도 외부 서비스의 API를 호출하는 형태로 구현될 것이라고 생각함
   */
  async getUserInfo(userId: string): Promise<Record<string, any>> {
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
