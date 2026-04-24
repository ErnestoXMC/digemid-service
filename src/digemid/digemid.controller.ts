import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DigemidService } from './digemid.service';
import { CreateDigemidDto } from './dto/create-digemid.dto';
import { UpdateDigemidDto } from './dto/update-digemid.dto';

@Controller('digemid')
export class DigemidController {
  constructor(private readonly digemidService: DigemidService) {}

  @Post()
  create(@Body() createDigemidDto: CreateDigemidDto) {
    return this.digemidService.create(createDigemidDto);
  }

  @Get()
  findAll() {
    return this.digemidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.digemidService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDigemidDto: UpdateDigemidDto) {
    return this.digemidService.update(+id, updateDigemidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.digemidService.remove(+id);
  }
}
