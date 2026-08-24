import { IsString, IsOptional, IsNumber, Min, IsDecimal } from 'class-validator';

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

  @IsNumber()
  @Min(0)
  @IsOptional()
  goalAmount?: number;
}
