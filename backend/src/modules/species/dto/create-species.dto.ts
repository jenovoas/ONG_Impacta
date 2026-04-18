import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpeciesDto {
  @IsString()
  @IsNotEmpty()
  commonName: string;

  @IsString()
  @IsOptional()
  scientificName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
