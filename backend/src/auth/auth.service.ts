import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string, orgSlug: string): Promise<any> {
    const user = await this.database.user.findFirst({
      where: {
        email,
        organization: {
          slug: orgSlug,
        },
      },
      include: {
        organization: true,
      },
    });

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      orgId: user.organizationId, 
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
