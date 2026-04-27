import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto, UserUpdateResponseDto, UserUpdateStatusResponseDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Person } from 'src/people/entities/person.entity';
import { Role } from 'src/roles/entities/role.entity';
import { DataSource } from 'typeorm';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { toDto, toDtoList } from 'src/helpers/plan-to-dto.helper';
import { PaginationDto } from 'src/common/dto';
import { FilterSimplePagination } from 'src/common/interfaces/filter.interface';


@Injectable()
export class UsersService {

    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        //* Datasource para transacciones
        private readonly dataSource: DataSource,

    ) { }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {

        //* Desestructuracion del dto
        const { person, passwordHash, roleCode, ...userProperties } = createUserDto;

        //* Implementacion de transacciones con QueryRunner
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            //* Verificamos la existencia del rol
            const role = await queryRunner.manager.findOneBy(Role, {
                code: roleCode,
                isActive: true
            });

            if (!role) throw new NotFoundException("No se encontró el rol o se encuentra inactivo.")

            //* Creamos nuestro obj y lo registramos con los datos del dto
            const personObj = queryRunner.manager.create(Person, person);
            const personSaved = await queryRunner.manager.save(personObj);

            //* Encriptamos la contraseña usando bycript
            //* Creamos el obj de usuario
            const user = queryRunner.manager.create(User, {
                ...userProperties,
                passwordHash: bcrypt.hashSync(passwordHash, 10),
                role,
                person: personSaved
            })

            //* Registramos el usuario a la bd
            const userSaved = await queryRunner.manager.save(user);

            //* Finalizamos la transaccion y retornamos el usuario registrado
            await queryRunner.commitTransaction();
            return toDto(UserResponseDto, userSaved);

        } catch (error: any) {
            //* Rollback en caso falle en alguna seccion
            await queryRunner.rollbackTransaction();

            //* Excepcion en caso el rol ingresado no se encuentre
            if (error instanceof NotFoundException) throw error;

            //* Excepcion en caso existan campos unicos duplicados en nuestra bd
            if (error.code = "ER_DUP_ENTRY")
                throw new BadRequestException("El numero de documento o email personal/corporativo ya ha sido registrado previamente.");

            this.logger.error(error);
            throw new InternalServerErrorException("Error al registrar el usuario y persona.");

        } finally {
            //* Liberamos el queryrunner
            await queryRunner.release();
        }

    }

    async findAll(paginationDto: PaginationDto): Promise<UserResponseDto[]> {
        const { limit = 10, offset = 0 } = paginationDto;

        const filter: FilterSimplePagination = {
            take: limit,
            skip: offset,
            order: {
                createdAt: 'DESC'
            }
        }

        const users: User[] = await this.userRepository.find(filter);
        return toDtoList(UserResponseDto, users);
    }

    async findOne(id: number): Promise<UserResponseDto> {

        const user: User | null = await this.userRepository.findOneBy({ id });

        if (!user) throw new NotFoundException(`No se encontró el usuario.`);

        return toDto(UserResponseDto, user);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserUpdateResponseDto> {

        try {

            const { roleCode, ...userUpdateProperties } = updateUserDto;

            //* Buscar rol por codigo y que este activo
            const role = await this.roleRepository.findOneBy({
                code: roleCode,
                isActive: true
            });

            if (!role) throw new NotFoundException("No se encontró el rol o se encuentra inactivo.")

            //* Busqueda y creacion del objeto user con los nuevos campos
            const user = await this.userRepository.preload({
                id,
                role,
                ...userUpdateProperties
            });

            if (!user) throw new NotFoundException("No se encontró el usuario.");

            const userSaved = await this.userRepository.save(user);

            return toDto(UserUpdateResponseDto, userSaved);

        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;

            if (error.code === "ER_DUP_ENTRY")
                throw new BadRequestException("El correo corporativo ya ha sido registrado previamente.")

            this.logger.error(error);
            throw new InternalServerErrorException("Error al actualizar el usuario.")
        }
    }

    async updateStatus(id: number, status: boolean): Promise<UserUpdateStatusResponseDto> {

        try {

            const user = await this.userRepository.preload({
                id,
                isActive: status
            });

            if (!user) throw new NotFoundException("No se encontró al usuario.");

            const userSaved = await this.userRepository.save(user);

            return toDto(UserUpdateStatusResponseDto, userSaved);

        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException("Error al actualizar el estado del usuario");

        }
    }

    async resetPassword(id: number): Promise<string> {

        try {
            const user = await this.userRepository.findOneBy({ id });

            if (!user) throw new NotFoundException("No se encontró al usuario.");

            const randomPassword = this.generatePassword();

            user.passwordHash = bcrypt.hashSync(randomPassword, 10);

            await this.userRepository.save(user);

            return randomPassword;

        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException("Error al generar la contraseña del usuario.");
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const user = await this.userRepository.findOneBy({ id });

            if (!user) throw new NotFoundException('Usuario no encontrado o se encuentra inactivo.');

            await this.userRepository.softRemove(user);

        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            this.logger.error(error);
            throw new InternalServerErrorException('Error al eliminar el usuario.');
        }
    }

    private generatePassword(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let randomPassword = '';

        for (let i = 0; i < 10; i++) {
            const randomIndex = crypto.randomInt(0, chars.length);
            randomPassword += chars[randomIndex];
        }

        return randomPassword;
    }
}
