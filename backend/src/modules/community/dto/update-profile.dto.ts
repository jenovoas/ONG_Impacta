import { IsIn, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  commune?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(300)
  website?: string;

  @IsOptional()
  @IsIn(['PRIVATE', 'COMMUNITY', 'PUBLIC'])
  visibility?: string;
}
