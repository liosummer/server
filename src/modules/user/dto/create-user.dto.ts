import { IsNotEmpty, IsString, IsByteLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsByteLength(2, 10)
  @ApiProperty({ description: '姓名', example: '小满' })
  username: string;
  @IsNotEmpty()
  @IsString()
  @IsByteLength(6, 10)
  @ApiProperty({ description: '姓名', example: '小满' })
  password: string;
}
export class UpdateUserDto {
  @IsNotEmpty()
  username?: string;
  gender?: number;
  id: string;
}
export class FindUserDto {
  @IsNotEmpty()
  username?: string;
  id?: string;
}

export class FindUserListDto {
  @IsNotEmpty()
  page: number;
  pageSize: number;
  [propName: string]: any;
}
