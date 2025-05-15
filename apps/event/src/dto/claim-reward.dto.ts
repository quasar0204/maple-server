import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ClaimRewardDto {
  @IsMongoId()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
