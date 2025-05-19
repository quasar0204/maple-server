import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { RewardItemResponseDto } from './reward-item.dto';

class ComparisonConditionDto {
  @ApiProperty({ example: 'comparison' })
  type: 'comparison';

  @ApiProperty({ example: 'level' })
  field: string;

  @ApiProperty({
    example: '>=',
    enum: ['>=', '<=', '>', '<', '==', '!='],
  })
  operator: '>=' | '<=' | '>' | '<' | '==' | '!=';

  @ApiProperty({ example: 260 })
  value: number | string;
}

class AchievementConditionDto {
  @ApiProperty({ example: 'achievement' })
  type: 'achievement';

  @ApiProperty({ example: 'DAILY_LOGIN_365' })
  achievementId: string;
}

@ApiExtraModels(ComparisonConditionDto, AchievementConditionDto)
export class ResponseEventDto {
  @ApiProperty({ example: '665001f8f3a8a9b9f5cdab12' })
  _id: string;

  @ApiProperty({ example: '레벨 달성 이벤트' })
  title: string;

  @ApiProperty({ example: '260 이상 달성시 보상 지급' })
  description: string;

  @ApiProperty({ example: 'ON_DEMAND' })
  triggerType: 'ON_DEMAND' | 'ON_EVENT';

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ComparisonConditionDto) },
      { $ref: getSchemaPath(AchievementConditionDto) },
    ],
    isArray: true,
  })
  conditions: (ComparisonConditionDto | AchievementConditionDto)[];

  @ApiProperty({ example: '2025-06-01T00:00:00Z' })
  startDate: string;

  @ApiProperty({ example: '2025-06-30T23:59:59Z' })
  endDate: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({
    type: [RewardItemResponseDto],
    description: '이벤트에 등록된 보상 목록',
  })
  rewards: RewardItemResponseDto[];
}
