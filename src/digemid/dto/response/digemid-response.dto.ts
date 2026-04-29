import { Exclude, Expose } from "class-transformer";


export class DigemidResponseDto {

    @Expose() id: number;
    @Expose() codigoProducto: string;
    @Expose() nombreProducto: string;
    @Expose() concentracion: string;
    @Expose() formaFarmaceutica: string;
    @Expose() presentacion: string;
    @Expose() fraccion: string;
    @Expose() numeroRegistroSanitario: string;
    @Expose() nombreTitular: string;
    @Expose() nombreFabricante: string;
    @Expose() nombreIFA: string;
    @Expose() nombreRubro: string;
    @Expose() situacion: string;

    //* Campos excluidos
    @Exclude() createdAt: Date;
    @Exclude() updatedAt: Date;
}