import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateP2PPageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  personalGoal?: number;
}
