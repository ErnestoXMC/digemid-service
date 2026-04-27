import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { PeopleService } from './people.service';
import { UpdatePersonDto } from './dto';

@Controller('people')
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) { }

    @Get()
    findAll() {
        return this.peopleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.peopleService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
        return this.peopleService.update(+id, updatePersonDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.peopleService.remove(+id);
    }
}
