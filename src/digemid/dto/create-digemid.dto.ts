import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDigemidDto {

    @IsString()
    @MaxLength(255)
    codigoProducto: string;

    @IsString()
    @MaxLength(255)
    nombreProducto: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    concentracion?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    formaFarmaceutica?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    presentacion?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    fraccion?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    numeroRegistroSanitario?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    nombreTitular?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    nombreFabricante?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    nombreIFA?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    nombreRubro?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    situacion?: string;
}

