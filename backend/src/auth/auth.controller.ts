import { Controller, Post, Body, UnauthorizedException, Get, Request } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  orgSlug: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
      loginDto.orgSlug,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
