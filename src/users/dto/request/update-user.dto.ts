import { IsEmail, IsEnum, IsOptional, MaxLength } from "class-validator";
import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { RoleCode } from "src/roles/entities/role.entity";


@ApiSchema({ name: 'AdminUpdateUserDto' })
export class UpdateUserDto {

    @ApiPropertyOptional({ description: 'Correo corporativo', example: 'juan@empresa.com' })
    @IsOptional()
    @IsEmail({}, { message: 'El formato del correo corporativo no es válido' })
    @MaxLength(200, { message: 'El correo corporativo es demasiado largo' })
    corporateEmail?: string;

    @ApiPropertyOptional({ description: 'Código del rol', enum: RoleCode, example: 'admin' })
    @IsOptional()
    @IsEnum(RoleCode, { message: 'El rol asignado no es válido' })
    roleCode?: RoleCode;
}
