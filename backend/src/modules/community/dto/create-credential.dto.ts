import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateCredentialDto {
  @IsUUID()
  disciplineId: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  issuer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  credentialRef?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  evidenceUrl?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
