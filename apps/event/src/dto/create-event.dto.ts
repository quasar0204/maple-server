import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ComparisonConditionDto {
  @IsString()
  type: 'comparison';

  @IsString()
  field: string;

  @IsEnum(['>=', '<=', '>', '<', '==', '!='])
  operator: '>=' | '<=' | '>' | '<' | '==' | '!=';

  value: any;
}

class AchievementConditionDto {
  @IsString()
  type: 'achievement';

  @IsString()
  achievementId: string;
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['ON_DEMAND', 'ON_EVENT'])
  triggerType: 'ON_DEMAND' | 'ON_EVENT';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  conditions: (ComparisonConditionDto | AchievementConditionDto)[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}