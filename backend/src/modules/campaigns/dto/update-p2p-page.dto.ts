import { IsEnum } from 'class-validator';

export class UpdateP2PPageDto {
  @IsEnum(['ACTIVE', 'CANCELLED'])
  status: 'ACTIVE' | 'CANCELLED';
}
