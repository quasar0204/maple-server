import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimRewardDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: '6647dc3b4d2e5b7fbc9c1e3a',
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({ description: '유저 ID', example: 'test-user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
