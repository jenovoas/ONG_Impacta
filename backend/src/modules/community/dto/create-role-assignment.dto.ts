import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateRoleAssignmentDto {
  @IsUUID()
  userId: string;

  @IsString()
  @MaxLength(80)
  role: string;

  @IsOptional()
  @IsUUID()
  collectiveId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  scope?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
