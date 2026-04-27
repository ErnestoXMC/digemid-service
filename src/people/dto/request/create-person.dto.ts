import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { DocumentType } from "src/people/entities/person.entity";

@ApiSchema({ name: 'AdminCreatePersonDto' })
export class CreatePersonDto {

    @ApiProperty({ description: 'Nombre de la persona', example: 'Juan', minLength: 2, maxLength: 50 })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @IsString({ message: 'El nombre debe ser texto.' })
    @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres.' })
    firstName: string;

    @ApiProperty({ description: 'Apellido de la persona', example: 'Pérez', minLength: 2, maxLength: 50 })
    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    @IsString({ message: 'El apellido debe ser texto.' })
    @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres.' })
    lastName: string;

    @ApiProperty({ description: 'Tipo de documento', enum: DocumentType, example: DocumentType.DNI })
    @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
    @IsEnum(DocumentType, { message: "El tipo de documento ingresado no es válido" })
    documentType: DocumentType;

    @ApiProperty({ description: 'Número de documento', example: '72345678', minLength: 8, maxLength: 20 })
    @IsNotEmpty({ message: 'El número de documento es obligatorio.' })
    @IsString({ message: 'El número de documento debe ser texto.' })
    @Length(8, 20, { message: 'El número de documento debe tener entre 8 y 20 caracteres.' })
    @Matches(/^[A-Za-z0-9]+$/, { message: 'El número de documento solo debe contener letras y números.' })
    documentNumber: string;

}
