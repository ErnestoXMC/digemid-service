import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DigemidService } from './digemid.service';
import { UpdateDigemidDto } from './dto/update-digemid.dto';
import { PaginationDto } from 'src/common/dto';

@Controller('digemid')
export class DigemidController {

    constructor(private readonly digemidService: DigemidService) { }
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { //* Interceptamos el req para buscar el file
        storage: memoryStorage(), //* Guardamos el archivo en ram como buffer (no en disco)
        limits: { fileSize: 15 * 1024 * 1024 }, //* Rechaza el archivo si pesa más de 15MB
        fileFilter: (req, file, cb) => { //* Solo acepta archivos con estas extensiones (xlsx o xls)
            const allowed = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (!allowed.includes(file.mimetype))
                return cb(new BadRequestException('Solo se permiten archivos .xlsx o .xls'), false);
            cb(null, true);
        },
    }))
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No se recibió ningún archivo');
        return await this.digemidService.uploadExcel(file);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.digemidService.findAll(paginationDto);
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
