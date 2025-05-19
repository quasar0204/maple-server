import { IsMongoId, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RewardItemDto {
  @ApiProperty({ enum: ['item', 'point', 'coupon'], example: 'item' })
  type: 'item' | 'point' | 'coupon';

  @ApiProperty({ example: 'itemA' })
  value: string;

  @ApiProperty({ example: 5 })
  quantity: number;
}

export class CreateRewardDto {
  @ApiProperty({ description: '이벤트 ID', example: '6647dc3b4d2e5b7fbc9c1e3a' })
  @IsMongoId()
  eventId: string;

  @ApiProperty({ type: [RewardItemDto], description: '보상 항목 목록' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardItemDto)
  rewards: RewardItemDto[];
}