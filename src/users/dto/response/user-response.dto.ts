import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PersonInUserDto {
    @ApiProperty({ description: 'ID de la persona', example: 1 })
    @Expose() id: number;

    @ApiProperty({ description: 'Nombre', example: 'Juan' })
    @Expose() firstName: string;

    @ApiProperty({ description: 'Apellido', example: 'Pérez' })
    @Expose() lastName: string;

    @ApiProperty({ description: 'Tipo de documento', example: 'dni' })
    @Expose() documentType: string;

    @ApiProperty({ description: 'Número de documento', example: '72345678' })
    @Expose() documentNumber: string;

    @ApiProperty({ description: 'Teléfono', example: '+51995620924', nullable: true })
    @Expose() phone: string;

    @ApiProperty({ description: 'Email personal', example: 'juan@gmail.com', nullable: true })
    @Expose() personalEmail: string;

    @ApiProperty({ description: 'URL de la foto', example: 'https://cdn.example.com/photo.jpg', nullable: true })
    @Expose() photoUrl: string;
}

class RoleInUserDto {
    @ApiProperty({ description: 'ID del rol', example: 1 })
    @Expose() id: number;

    @ApiProperty({ description: 'Código del rol', example: 'admin' })
    @Expose() code: string;

    @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
    @Expose() name: string;
}

export class UserResponseDto {
    @ApiProperty({ description: 'ID del usuario', example: 1 })
    @Expose() id: number;

    @ApiProperty({ description: 'Correo corporativo', example: 'juan@empresa.com' })
    @Expose() corporateEmail: string;

    @ApiProperty({ description: 'Estado del usuario', example: true })
    @Expose() isActive: boolean;

    @ApiProperty({ description: 'Último inicio de sesión', example: '2024-01-15T10:30:00Z', nullable: true })
    @Expose() lastLogin: Date;

    @ApiProperty({ description: 'Persona asociada', type: PersonInUserDto })
    @Expose()
    @Type(() => PersonInUserDto)
    person: PersonInUserDto;

    @ApiProperty({ description: 'Rol asignado', type: RoleInUserDto })
    @Expose()
    @Type(() => RoleInUserDto)
    role: RoleInUserDto;
}

export class UserUpdateResponseDto {
    @ApiProperty({ description: 'ID del usuario', example: 1 })
    @Expose() id: number;

    @ApiProperty({ description: 'Correo corporativo', example: 'juan@empresa.com' })
    @Expose() corporateEmail: string;

    @ApiProperty({ description: 'Estado del usuario', example: true })
    @Expose() isActive: boolean;

    @ApiProperty({ description: 'Último inicio de sesión', example: '2024-01-15T10:30:00Z', nullable: true })
    @Expose() lastLogin: Date;

    @ApiProperty({ description: 'Rol asignado', type: RoleInUserDto })
    @Expose()
    @Type(() => RoleInUserDto)
    role: RoleInUserDto;
}

export class UserUpdateStatusResponseDto {
    @ApiProperty({ description: 'ID del usuario', example: 1 })
    @Expose() id: number;

    @ApiProperty({ description: 'Correo corporativo', example: 'juan@empresa.com' })
    @Expose() corporateEmail: string;

    @ApiProperty({ description: 'Estado del usuario', example: true })
    @Expose() isActive: boolean;

    @ApiProperty({ description: 'Último inicio de sesión', example: '2024-01-15T10:30:00Z', nullable: true })
    @Expose() lastLogin: Date;
}