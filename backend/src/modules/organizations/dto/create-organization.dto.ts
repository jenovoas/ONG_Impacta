import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export const ORGANIZATION_PLANS = ['FREE', 'PRO', 'ENTERPRISE'] as const;
export type OrganizationPlan = (typeof ORGANIZATION_PLANS)[number];

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(60)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase kebab-case (a-z, 0-9, hyphens)',
  })
  slug!: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  logo?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @IsOptional()
  @IsIn(ORGANIZATION_PLANS)
  plan?: OrganizationPlan;
}
