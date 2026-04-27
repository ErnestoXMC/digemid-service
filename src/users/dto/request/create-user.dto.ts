import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength, ValidateNested } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { RoleCode } from "src/roles/entities/role.entity";
import { CreatePersonDto } from "src/people/dto";

@ApiSchema({ name: 'AdminCreateUserDto' })
export class CreateUserDto {

    @ApiProperty({ description: 'Correo corporativo', example: 'juan@empresa.com' })
    @IsNotEmpty({message: 'El correo corporativo es obligatorio'})
    @IsEmail({}, {message: 'El formato del correo corporativo no es válido'})
    @MaxLength(200, {message: 'El correo corporativo es demasiado largo'})
    corporateEmail: string;

    @ApiProperty({ description: 'Contraseña', example: 'Password123', minLength: 8 })
    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(250, {message: 'La contraseña es demasiado larga'})
    passwordHash: string;

    @ApiProperty({ description: 'Código del rol', enum: RoleCode, example: 'admin' })
    @IsNotEmpty({message: 'El rol es obligatorio'})
    @IsEnum(RoleCode, { message: 'El rol asignado no es válido' })
    roleCode: RoleCode;

    //* Dto Anidado, obtenemos el createPersonDto para crear la persona al mismo tiempo que el usuario
    @ApiProperty({ description: 'Datos de la persona', type: CreatePersonDto })
    @IsNotEmpty({ message: 'Los datos de la persona son obligatorios' })
    @ValidateNested()
    @Type(() => CreatePersonDto)
    person: CreatePersonDto;
}
