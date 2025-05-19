import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RewardItemDto {
  type: 'item' | 'point' | 'coupon';
  value: string;
  quantity: number;
}

export class UpdateRewardDto {
  @ApiProperty({ type: [RewardItemDto], description: '보상 항목 목록' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardItemDto)
  rewards: RewardItemDto[];
}
