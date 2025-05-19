import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsInt, Min } from 'class-validator';

export class RewardItemBaseDto {
  @ApiProperty({
    enum: ['item', 'point', 'coupon'],
    description: '보상 타입',
    example: 'item',
  })
  @IsIn(['item', 'point', 'coupon'])
  type: 'item' | 'point' | 'coupon';

  @ApiProperty({ description: '보상 값', example: 'ITEM123' })
  @IsString()
  value: string;

  @ApiProperty({ description: '수량', example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class RewardItemDto extends RewardItemBaseDto {}

export class RewardItemResponseDto extends RewardItemBaseDto {}
