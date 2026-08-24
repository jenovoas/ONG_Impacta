import { IsIn, IsString } from 'class-validator';

export class UpdateRecurringDonationDto {
  @IsString()
  @IsIn(['PAUSED', 'CANCELLED', 'ACTIVE'])
  status: 'PAUSED' | 'CANCELLED' | 'ACTIVE';
}
