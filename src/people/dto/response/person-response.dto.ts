import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PersonResponseDto {
    @ApiProperty({ description: 'ID de la persona', example: 1 })
    @Expose() id: number;

    @ApiProperty({ description: 'Nombre de la persona', example: 'juan' })
    @Expose() firstName: string;

    @ApiProperty({ description: 'Apellido de la persona', example: 'perez' })
    @Expose() lastName: string;

    @ApiProperty({ description: 'Tipo de documento', example: 'dni' })
    @Expose() documentType: string;

    @ApiProperty({ description: 'Número de documento', example: '72345678' })
    @Expose() documentNumber: string;

    //* Campos excluidos
    @Exclude() createdAt: Date;
    @Exclude() updatedAt: Date;
}
