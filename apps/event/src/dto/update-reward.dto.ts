import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RewardItemDto {
  type: 'item' | 'point' | 'coupon';
  value: string;
  quantity: number;
}

export class UpdateRewardDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardItemDto)
  rewards: RewardItemDto[];
}
