import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { PaginationDto } from "./pagination.dto";
import { IsIn, IsOptional } from "class-validator";

export class PaginationStatusDto extends PartialType(PaginationDto) {
    @ApiPropertyOptional({ description: 'Filtrar por estado (0 = inactivo, 1 = activo)', example: '1', enum: ['0', '1'] })
    @IsOptional()
    @IsIn(['0', '1'], {message: 'El campo isActive debe ser 0 o 1.'})
    isActive?: string;
}