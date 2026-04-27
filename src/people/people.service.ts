import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdatePersonDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto';
import { FilterSimplePagination } from 'src/common/interfaces/filter.interface';
import { toDto, toDtoList } from 'src/helpers/plan-to-dto.helper';
import { PersonResponseDto } from './dto/response/person-response.dto';


@Injectable()
export class PeopleService {

    private readonly logger = new Logger(PeopleService.name);

    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>
    ) { }

    async findAll(paginationDto: PaginationDto): Promise<PersonResponseDto[]> {

        const { limit = 10, offset = 0 } = paginationDto;

        const filter: FilterSimplePagination = {
            take: limit,
            skip: offset,
            order: {
                createdAt: 'ASC'
            }
        }

        const people: Person[] = await this.personRepository.find(filter);

        return toDtoList(PersonResponseDto, people);
    }

    async findOne(term: string): Promise<PersonResponseDto> {
        term = term.trim();

        let person: Person | null = null;

        //* Verificamos si es un número
        if (!isNaN(Number(term))) {
            //* Consulta doble para encontrar una persona por id o numero de documento
            person = await this.personRepository.findOne({
                where: [{ id: Number(term) }, { documentNumber: term }],
            });
        } else {
            person = await this.personRepository.findOneBy({ documentNumber: term });
        }

        if (!person)
            throw new NotFoundException('No se encontró la persona.');

        return toDto(PersonResponseDto, person);
    }

    async update(id: number, updatePersonDto: UpdatePersonDto): Promise<PersonResponseDto> {

        try {

            //* Desestructuracion para el dto, principalmente para hacer consultas con los campos unicos documentNumber y personalEmail
            const { documentNumber, ...updatePersonProperties } = updatePersonDto;

            const person = await this.personRepository.findOneBy({ id });

            if (!person) throw new NotFoundException("Persona no encontrada.");

            //* En caso se pase el documentNumber buscar para no registrar elementos repetidos
            if (documentNumber) {
                const personByDocumentNumber = await this.personRepository.findOneBy({ documentNumber });

                //* Validar que el nuevo documentNumber sea diferente al de mi objeto
                if (personByDocumentNumber && personByDocumentNumber.id !== id)
                    throw new BadRequestException(`El número de documento '${documentNumber}' está en uso.`);

                //* Sobreescribimos el nuevo documentNumber al objeto
                person.documentNumber = documentNumber;
            }

            //* Asignamos las propiedades restantes del dto a mi objeto
            Object.assign(person, updatePersonProperties);

            const personSaved = await this.personRepository.save(person);

            return toDto(PersonResponseDto, personSaved);

        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            if (error instanceof BadRequestException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException("Error al actualizar la persona.")
        }
    }


    async remove(id: number): Promise<void> {
        try {
            const person = await this.personRepository.findOne({
                where: { id },
                relations: { user: true }
            });

            if (!person) throw new NotFoundException('No se encontró el usuario.');

            await this.personRepository.softRemove(person);

        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException('Error al eliminar el usuario.');
        }
    }
}
