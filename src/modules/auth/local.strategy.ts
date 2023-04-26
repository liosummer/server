import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
    this.authService = authService;
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validate(username, password);
    if (user) return user;
    else throw new UnauthorizedException('登录失败');
  }
}
