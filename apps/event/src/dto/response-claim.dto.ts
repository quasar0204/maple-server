import { ApiProperty } from '@nestjs/swagger';
import { RewardItemResponseDto } from './reward-item.dto';

export class ClaimResponseDto {
  @ApiProperty({ example: '665005c132e438c4bc93aa7d' })
  _id: string;

  @ApiProperty({ example: 'user-abc-123' })
  userId: string;

  @ApiProperty({ example: 'event-xyz-456' })
  eventId: string;

  @ApiProperty({
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
    example: 'SUCCESS',
  })
  status: 'SUCCESS' | 'FAILED' | 'PENDING';

  @ApiProperty({ example: '조건 충족' })
  reason: string;

  @ApiProperty({
    type: [RewardItemResponseDto],
    required: false,
    description: '성공한 경우 지급된 보상 목록',
  })
  rewardsGiven?: RewardItemResponseDto[];

  @ApiProperty({ example: '2025-06-01T00:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-01T00:00:00Z' })
  updatedAt: string;
}
