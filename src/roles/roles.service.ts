import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, RoleResponseDto, RoleUpdateStatusResponseDto, UpdateRoleDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { toDto, toDtoList } from 'src/helpers/plan-to-dto.helper';
import { FilterStatusPagination } from 'src/common/interfaces/filter.interface';
import { PaginationStatusDto } from 'src/common/dto';

@Injectable()
export class RolesService {

    private readonly logger = new Logger(RolesService.name);

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
        try {
            const role = this.roleRepository.create(createRoleDto);
            const roleSaved = await this.roleRepository.save(role);

            return toDto(RoleResponseDto, roleSaved);

        } catch (error: any) {
            if (error.code === '23505')
                throw new BadRequestException('El código de rol ya ha sido registrado previamente.');

            this.logger.error(error);
            throw new InternalServerErrorException('Error al registrar el rol.');
        }
    }

    async findAll(paginationStatusDto: PaginationStatusDto): Promise<RoleResponseDto[]> {
        const { limit = 10, offset = 0, isActive } = paginationStatusDto;

        const filter: FilterStatusPagination = {
            take: limit,
            skip: offset,
            where: {}
        }

        if (typeof isActive !== 'undefined' && isActive !== null) {
            if (isActive === '1') filter.where = { isActive: true };
            else if (isActive === '0') filter.where = { isActive: false };
        }

        const roles: Role[] = await this.roleRepository.find(filter);

        return toDtoList(RoleResponseDto, roles);
    }

    async findOne(id: number): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOneBy({ id });

        if (!role) throw new NotFoundException('Rol no encontrado.');

        return toDto(RoleResponseDto, role);
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
        try {
            const role = await this.roleRepository.preload({
                id,
                ...updateRoleDto
            });

            if (!role) throw new NotFoundException('Rol no encontrado.');

            return toDto(RoleResponseDto, await this.roleRepository.save(role));

        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException('Error al actualizar el rol.');
        }
    }

    //? Mejorar el codigo, implementar validacion, no cambiar el estado a inactivo si tiene un usuario activo relacionado
    async updateStatus(id: number, status: boolean): Promise<RoleUpdateStatusResponseDto> {

        try {
            const role = await this.roleRepository.preload({
                id,
                isActive: status
            });

            if (!role) throw new NotFoundException("Rol no encontrado");

            const roleSaved = await this.roleRepository.save(role);

            return toDto(RoleUpdateStatusResponseDto, roleSaved);

        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException("Error al actualizar el estado del rol.");
        }
    }
}

