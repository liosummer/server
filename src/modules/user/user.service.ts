import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, FindOptionsWhere } from 'typeorm';
import {
  CreateUserDto,
  FindUserDto,
  FindUserListDto,
  UpdateUserDto,
} from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { hashSync } from 'bcryptjs';
import { TypeOrmUtils } from '../../utils/TypeOrmUtils';
const like = (value) => {
  if (!value) return undefined;
  return Like(`%${value}%`);
};
// hashSync(密码，加密盐)加密
//compareSync(传入的数据,数据库的数据)判断是否相等
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const hasUser = await this.findOne({ username });
    if (hasUser) {
      throw new HttpException('该用户已注册', 400);
    }
    createUserDto.password = hashSync(password, 10);
    const user = this.userRepository.create(createUserDto);
    this.userRepository.save(user);
    return '注册成功';
  }

  async findOne(findUser: FindUserDto) {
    const { username, id } = findUser;
    const hasUser = await this.userRepository.findOneBy({ username, id });
    return hasUser;
  }

  async findAll(findUser: FindUserListDto, user) {
    const { username, gender, page, pageSize } = findUser;
    const where: FindOptionsWhere<User> = {
      username: TypeOrmUtils.like(username),
    };
    if (gender) {
      where.gender = gender;
    }
    const [items, total] = await this.userRepository.findAndCount({
      select: ['username', 'id', 'gender', 'createTime', 'showDelete'],
      where,
      order: {
        username: 'ASC',
        id: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    items.find((i) => i.id === user.id).showDelete = 0;
    return {
      items,
      total,
    };
  }

  async updateUser({ id, ...others }: UpdateUserDto) {
    const user = await this.findOne({ id });
    const newUser = Object.assign(user, others);
    await this.userRepository.save(newUser);
    return '修改成功';
  }

  async deleteUser(id: string) {
    const { affected } = await this.userRepository.delete(id);
    if (affected) return '删除成功';
    throw new HttpException('无该用户', 400);
  }
}
