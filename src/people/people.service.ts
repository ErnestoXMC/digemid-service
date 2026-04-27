import { Injectable } from '@nestjs/common';
import { UpdatePersonDto } from './dto';


@Injectable()
export class PeopleService {

    findAll() {
        return `This action returns all people`;
    }

    findOne(id: number) {
        return `This action returns a #${id} person`;
    }

    update(id: number, updatePersonDto: UpdatePersonDto) {
        return `This action updates a #${id} person`;
    }

    remove(id: number) {
        return `This action removes a #${id} person`;
    }
}
