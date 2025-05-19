import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ComparisonConditionDto {
  @ApiProperty({ example: 'comparison' })
  @IsString()
  type: 'comparison';

  @ApiProperty({ example: 'level', description: '조건을 검사할 유저 속성' })
  @IsString()
  field: string;

  @ApiProperty({ enum: ['>=', '<=', '>', '<', '==', '!='], example: '>=' })
  @IsEnum(['>=', '<=', '>', '<', '==', '!='])
  operator: '>=' | '<=' | '>' | '<' | '==' | '!=';

  @ApiProperty({ description: '비교할 값', example: 200 })
  value: any;
}

class AchievementConditionDto {
  @ApiProperty({ example: 'achievement' })
  @IsString()
  type: 'achievement';

  @ApiProperty({ example: 'DAILY_LOGIN_365', description: '달성한 업적 ID' })
  @IsString()
  achievementId: string;
}

export class CreateEventDto {
  @ApiProperty({ example: '익스트림 칼로스 처치 이벤트' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '익스트림 칼로스를 처치하면 쇼케이스 티켓을 드립니다',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ['ON_DEMAND', 'ON_EVENT'], example: 'ON_DEMAND' })
  @IsEnum(['ON_DEMAND', 'ON_EVENT'])
  triggerType: 'ON_DEMAND' | 'ON_EVENT';

  @ApiProperty({
    description: '이벤트 조건들',
    type: [Object],
    example: [{ type: 'achievement', achievementId: 'EXTREME_KALLOS_CLEAR' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  conditions: (ComparisonConditionDto | AchievementConditionDto)[];

  @ApiProperty({ example: '2025-05-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-06-07T23:59:59Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
