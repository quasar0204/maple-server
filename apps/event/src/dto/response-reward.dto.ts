import { ApiProperty } from '@nestjs/swagger';

export class RewardItemResponseDto {
  @ApiProperty({
    enum: ['item', 'point', 'coupon'],
    example: 'item',
    description: '보상 타입: 아이템, 포인트, 쿠폰 중 하나',
  })
  type: 'item' | 'point' | 'coupon';

  @ApiProperty({
    example: 'ITEM_CODE_001',
    description: '보상의 고유 값 (아이템 코드, 포인트 종류 등)',
  })
  value: string;

  @ApiProperty({
    example: 1,
    description: '지급 수량',
  })
  quantity: number;
}

export class RewardResponseDto {
  @ApiProperty({
    example: '665005c132e438c4bc93aa7d',
    description: 'Reward 문서의 MongoDB ObjectId',
  })
  _id: string;

  @ApiProperty({
    example: '665001f8f3a8a9b9f5cdab12',
    description: '해당 보상이 연결된 이벤트의 ID',
  })
  eventId: string;

  @ApiProperty({
    type: [RewardItemResponseDto],
    description: '보상 항목 배열',
  })
  rewards: RewardItemResponseDto[];
}
