import { IsMongoId, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RewardItemDto } from './reward-item.dto';

export class CreateRewardDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: '6647dc3b4d2e5b7fbc9c1e3a',
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({ type: [RewardItemDto], description: '보상 항목 목록' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardItemDto)
  rewards: RewardItemDto[];
}
