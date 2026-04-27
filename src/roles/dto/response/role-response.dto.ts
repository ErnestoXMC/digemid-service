import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
    @ApiProperty({ description: 'ID del rol', example: 1 })
    @Expose() id: number;

    @ApiProperty({ description: 'Código del rol', example: 'admin' })
    @Expose() code: string;

    @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
    @Expose() name: string;

    @ApiProperty({ description: 'Descripción del rol', example: 'Rol con acceso total al sistema' })
    @Expose() description: string;

    @ApiProperty({ description: 'Estado del rol', example: true })
    @Expose() isActive: boolean;

    //* Campos excluidos
    @Exclude() createdAt: Date;
    @Exclude() updatedAt: Date;
}

export class RoleUpdateStatusResponseDto {
    @ApiProperty({ description: 'ID del rol', example: 1 })
    @Expose() id: number;

    @ApiProperty({ description: 'Código del rol', example: 'admin' })
    @Expose() code: string;

    @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
    @Expose() name: string;

    @ApiProperty({ description: 'Estado del rol', example: true })
    @Expose() isActive: boolean;
}
