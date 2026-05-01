import { Injectable, Logger, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateDigemidDto } from './dto/update-digemid.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Digemid } from './entities/digemid.entity';
import { DataSource, Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterSimplePagination } from 'src/common/interfaces/filter.interface';
import { DigemidResponseDto } from './dto/response/digemid-response.dto';
import { toDto, toDtoList } from 'src/helpers/plan-to-dto.helper';

@Injectable()
export class DigemidService {

    private readonly logger = new Logger(DigemidService.name);
    private readonly CHUNK_SIZE = 500;

    constructor(
        @InjectRepository(Digemid)
        private readonly digemidRepository: Repository<Digemid>,
        private readonly dataSource: DataSource,
    ) {}

    async uploadExcel(file: Express.Multer.File) {

        //* Lee el buffer del archivo y lo convierte a un workbook de xlsx
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });

        //* Toma la primera hoja del Excel
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        //* Convierte la hoja en un array de objetos
        //* range: 6 → salta las 6 primeras filas (título/logo del Ministerio) y usa la fila 7 como cabeceras
        const rows: any[] = xlsx.utils.sheet_to_json(sheet, { range: 6 });

        if (rows.length === 0)
            throw new InternalServerErrorException('El archivo Excel está vacío o sin datos válidos');

        // Debug: muestra las cabeceras reales del Excel en consola (útil la primera vez)
        this.logger.debug(`Cabeceras detectadas: ${Object.keys(rows[0]).join(', ')}`);
        this.logger.log(`Procesando ${rows.length} registros...`);

        //* Todo dentro de una transacción: si algo falla, no se pierde ni borra nada
        await this.dataSource.transaction(async (manager) => {

            //* Elimina todos los registros anteriores de la tabla
            await manager.clear(Digemid);

            //* Inserta los nuevos registros en lotes de 500 para no saturar MySQL
            for (let i = 0; i < rows.length; i += this.CHUNK_SIZE) {
                const chunk = rows.slice(i, i + this.CHUNK_SIZE);
                const entities = chunk.map(row => this.mapRowToEntity(row));
                await manager.save(Digemid, entities);
                this.logger.log(`Insertados ${Math.min(i + this.CHUNK_SIZE, rows.length)} / ${rows.length}`);
            }
        });

        this.logger.log(`Carga completada: ${rows.length} registros insertados`);
        return { total: rows.length, message: 'Carga completada exitosamente' };
    }

    
    async findAll(paginationDto: PaginationDto): Promise<DigemidResponseDto[]> {

        const { limit = 10, offset = 0 } = paginationDto;

        const filter: FilterSimplePagination = {
            take: limit,
            skip: offset
        }

        const digemidData: Digemid[] = await this.digemidRepository.find(filter);

        return toDtoList(DigemidResponseDto, digemidData);
    }
    
    async findOne(term: string): Promise<DigemidResponseDto> {
        term = term.trim();

        let digemid: Digemid | null = null;

        if (!isNaN(Number(term))) {
            digemid = await this.digemidRepository.findOne({
                where: [{ id: Number(term) }, { codigoProducto: term }],
            });
        } else {
            digemid = await this.digemidRepository.findOneBy({ codigoProducto: term });
        }

        if (!digemid)
            throw new NotFoundException('No se encontró el producto Digemid.');

        return toDto(DigemidResponseDto, digemid);
    }

    async update(id: number, updateDigemidDto: UpdateDigemidDto): Promise<DigemidResponseDto> {
        try {
            const { codigoProducto, ...updateProperties } = updateDigemidDto;

            const digemid = await this.digemidRepository.findOneBy({ id });

            if (!digemid) throw new NotFoundException('Producto Digemid no encontrado.');

            if (codigoProducto) {
                const existing = await this.digemidRepository.findOneBy({ codigoProducto });

                if (existing && existing.id !== id)
                    throw new BadRequestException(`El código de producto '${codigoProducto}' ya está en uso.`);

                digemid.codigoProducto = codigoProducto;
            }

            Object.assign(digemid, updateProperties);

            const saved = await this.digemidRepository.save(digemid);

            return toDto(DigemidResponseDto, saved);

        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            if (error instanceof BadRequestException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException('Error al actualizar el producto Digemid.');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const digemid = await this.digemidRepository.findOneBy({ id });

            if (!digemid) throw new NotFoundException('No se encontró el producto Digemid.');

            await this.digemidRepository.softRemove(digemid);

        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException('Error al eliminar el producto Digemid.');
        }
    }
    //* Mapea una fila del Excel a la entidad Digemid
    //! IMPORTANTE: los strings entre comillas deben coincidir con las cabeceras exactas del Excel
    private mapRowToEntity(row: any): Digemid {
        const entity = new Digemid();
        entity.codigoProducto = String(row['Cod_Prod'] ?? '');
        entity.nombreProducto = String(row['Nom_Prod'] ?? '');
        entity.concentracion = String(row['Concent'] ?? '');
        entity.formaFarmaceutica = String(row['Nom_Form_Farm'] ?? '');
        entity.presentacion = String(row['Presentac'] ?? '');
        entity.fraccion = String(row['Fracción'] ?? '');
        entity.numeroRegistroSanitario = String(row['Num_RegSan'] ?? '');
        entity.nombreTitular = String(row['Nom_Titular'] ?? '');
        entity.nombreFabricante = String(row['Nom_Fabricante'] ?? '');
        entity.nombreIFA = String(row['Nom_IFA'] ?? '');
        entity.nombreRubro = String(row['Nom_Rubro'] ?? '');
        entity.situacion = String(row['Situación'] ?? '');
        return entity;
    }
}

