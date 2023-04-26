import { Injectable, HttpException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from '../../modules/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../modules/user/user.service';
import { compareSync } from 'bcryptjs';
@Injectable()
export class AuthService {
  private readonly userService: UserService;
  private readonly jwtService: JwtService;
  constructor(userService: UserService, jwtService: JwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  async validate(username: string, password: string): Promise<User> {
    const hasUser = await this.userService.findOne({ username });
    if (!hasUser) {
      throw new HttpException('该用户未注册', 400);
    }
    // 注：实际中的密码处理应通过加密措施
    if (!compareSync(password, hasUser.password)) {
      throw new HttpException('密码错误', 400);
    }
    return hasUser;
  }

  async login(user: User): Promise<any> {
    const { username } = user;
    const { password, ...others } = await this.userService.findOne({
      username,
    });
    return {
      token: this.jwtService.sign(others),
    };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
