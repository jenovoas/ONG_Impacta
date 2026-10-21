import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PublicAssistantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(4000)
  prompt: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  model?: string;
}
