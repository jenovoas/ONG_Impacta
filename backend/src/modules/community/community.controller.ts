import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthUser } from '../../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CommunityService } from './community.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyCredentialDto } from './dto/verify-credential.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.communityService.getProfile(user.id);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.communityService.upsertProfile(user.id, dto);
  }

  @Get('disciplines')
  listDisciplines() {
    return this.communityService.listDisciplines();
  }

  @Get('credentials')
  listCredentials(@CurrentUser() user: AuthUser) {
    return this.communityService.listCredentials(user.id);
  }

  @Post('credentials')
  createCredential(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateCredentialDto,
  ) {
    return this.communityService.createCredential(user.id, dto);
  }

  @Get('roles')
  listRoleAssignments(
    @CurrentUser() user: AuthUser,
    @CurrentTenant() organizationId: string,
  ) {
    return this.communityService.listRoleAssignments(user.id, organizationId);
  }

  @Post('roles')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  createRoleAssignment(
    @CurrentUser() user: AuthUser,
    @CurrentTenant() organizationId: string,
    @Body() dto: CreateRoleAssignmentDto,
  ) {
    return this.communityService.createRoleAssignment(
      user.id,
      organizationId,
      dto,
    );
  }

  @Patch('credentials/:id/verification')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  verifyCredential(
    @CurrentUser() user: AuthUser,
    @CurrentTenant() organizationId: string,
    @Param('id') credentialId: string,
    @Body() dto: VerifyCredentialDto,
  ) {
    return this.communityService.verifyCredential(
      user.id,
      organizationId,
      credentialId,
      dto,
    );
  }
}
