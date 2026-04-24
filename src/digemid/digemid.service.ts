import { Injectable } from '@nestjs/common';
import { CreateDigemidDto } from './dto/create-digemid.dto';
import { UpdateDigemidDto } from './dto/update-digemid.dto';

@Injectable()
export class DigemidService {
  create(createDigemidDto: CreateDigemidDto) {
    return 'This action adds a new digemid';
  }

  findAll() {
    return `This action returns all digemid`;
  }

  findOne(id: number) {
    return `This action returns a #${id} digemid`;
  }

  update(id: number, updateDigemidDto: UpdateDigemidDto) {
    return `This action updates a #${id} digemid`;
  }

  remove(id: number) {
    return `This action removes a #${id} digemid`;
  }
}
