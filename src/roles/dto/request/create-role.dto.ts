import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { RoleCode } from '../../entities/role.entity';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'AdminCreateRoleDto' })
export class CreateRoleDto {

    @ApiProperty({ description: 'Código del rol', enum: RoleCode, example: 'admin' })
    @IsNotEmpty({ message: 'El código es obligatorio.' })
    @IsEnum(RoleCode, { message: 'El código ingresado no es válido.' })
    code: RoleCode;

    @ApiProperty({ description: 'Nombre del rol', example: 'Administrador', minLength: 3, maxLength: 250 })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    @MaxLength(250, { message: 'El nombre no puede superar los 250 caracteres.' })
    name: string;

    @ApiProperty({ description: 'Descripción del rol', example: 'Rol con acceso total al sistema', minLength: 3, maxLength: 500 })
    @IsNotEmpty({ message: 'La descripción es obligatoria.' })
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres.' })
    @MaxLength(500, { message: 'La descripción no puede superar los 500 caracteres.' })
    description: string;
}
