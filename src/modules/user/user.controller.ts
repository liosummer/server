import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Delete,
  Patch,
  Query,
  Request,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import {
  CreateUserDto,
  FindUserDto,
  UpdateUserDto,
  FindUserListDto,
} from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Public } from '../../common/public.decorator';
@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '注册' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据token获取用户信息' })
  @Get('info')
  userInfo(@Request() request) {
    return request.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取用户列表' })
  @Get()
  findAll(
    @Request() request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number,
    @Query('gender', new DefaultValuePipe(0), ParseIntPipe) gender: number,
    @Query()
    findUser: FindUserListDto,
  ) {
    findUser.page = page;
    findUser.pageSize = pageSize;
    findUser.gender = gender;
    return this.userService.findAll(findUser, request.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: '编辑用户' })
  updateUser(
    @Body('gender', new DefaultValuePipe(2), ParseIntPipe) gender: number,
    @Body('username') username: string,
    @Param('id') id: string,
  ) {
    return this.userService.updateUser({ gender, username, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
