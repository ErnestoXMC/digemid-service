import { IsInt, IsOptional, Max, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";


export class PaginationDto {

    @ApiPropertyOptional({ description: 'Cantidad de registros a retornar', example: 10, minimum: 0 })
    @IsOptional()
    @IsInt({message: "El parametro limit debe ser un entero"})
    @Min(0, {message: "El parametro limit debe ser mayor o igual a cero"})
    limit?: number;

    @ApiPropertyOptional({ description: 'Cantidad de registros a saltar', example: 0, minimum: 0 })
    @IsOptional()
    @IsInt({message: "El parametro offset debe ser un numero entero"})
    @Min(0, {message: "El parametro offset debe ser mayor o igual a 0"})
    offset?: number;
}