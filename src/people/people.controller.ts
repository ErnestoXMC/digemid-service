import { Controller, Get, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PeopleService } from './people.service';
import { UpdatePersonDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Controller('people')
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) { }

    @Get()
    async findAll(
        @Query() paginationDto: PaginationDto
    ) {
        return await this.peopleService.findAll(paginationDto);
    }

    @Get(':term')
    async findOne(@Param('term') term: string) {
        return await this.peopleService.findOne(term);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePersonDto: UpdatePersonDto) {
        return this.peopleService.update(id, updatePersonDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.peopleService.remove(id);
    }
}
