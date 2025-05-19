import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateClaimStatusDto {
  @ApiProperty({ enum: ['SUCCESS', 'FAILED'], description: '보상 처리 상태' })
  @IsEnum(['SUCCESS', 'FAILED'])
  status: 'SUCCESS' | 'FAILED';

  @ApiProperty({ description: '사유', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
