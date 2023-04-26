import { Injectable } from '@nestjs/common';
import { CreateSmtpDto } from './dto/create-smtp.dto';
import { UpdateSmtpDto } from './dto/update-smtp.dto';

@Injectable()
export class SmtpService {
  create(createSmtpDto: CreateSmtpDto) {
    return 'This action adds a new smtp';
  }

  findAll() {
    return `This action returns all smtp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} smtp`;
  }

  update(id: number, updateSmtpDto: UpdateSmtpDto) {
    return `This action updates a #${id} smtp`;
  }

  remove(id: number) {
    return `This action removes a #${id} smtp`;
  }
}
