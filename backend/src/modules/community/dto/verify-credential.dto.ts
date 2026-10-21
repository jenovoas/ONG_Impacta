import { IsIn } from 'class-validator';

export class VerifyCredentialDto {
  @IsIn(['VERIFIED', 'REJECTED'])
  status: 'VERIFIED' | 'REJECTED';
}
