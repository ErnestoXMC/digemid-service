import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Digemid {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        length: 255,
        unique: true,
        name: 'codigo_producto'
    })
    codigoProducto: string;

    @Index()
    @Column('varchar', {
        length: 255,
        name: 'nombre_producto'
    })
    nombreProducto: string;

    @Column('varchar', {
        length: 255,
        name: 'concentracion'
    })
    concentracion: string;

    @Column('varchar', {
        length: 255,
        name: 'forma_farmaceutica'  
    })
    formaFarmaceutica: string;

    @Column('varchar', {
        length: 255
    })
    presentacion: string;

    @Column('varchar', {
        length: 255
    })
    fraccion: string;

    @Column('varchar', {
        length: 255,
        name: 'numero_registro_sanitario'
    })
    numeroRegistroSanitario: string;

    @Column('varchar', {
        length: 255,
        name: 'nombre_titular'
    })
    nombreTitular: string;


    @Column('varchar', {
        length: 255,
        name: 'nombre_fabricante'
    })
    nombreFabricante: string;

    @Column('varchar', {
        length: 255,
        name: 'nombre_ifa'
    })
    nombreIFA: string; //* Nombre del Ingrediente Farmacéutico Activo

    @Column('varchar', {
        length: 255,
        name: 'nombre_rubro'
    })
    nombreRubro: string;

    @Column('varchar', {
        length: 255
    })
    situacion: string;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    sanitizeFields() {

        if(this.codigoProducto) this.codigoProducto = this.codigoProducto.trim();
        if(this.nombreProducto) this.nombreProducto = this.nombreProducto.toUpperCase().trim();
        if(this.concentracion) this.concentracion = this.concentracion.trim();
        if(this.formaFarmaceutica) this.formaFarmaceutica = this.formaFarmaceutica.trim();
        if(this.presentacion) this.presentacion = this.presentacion.trim();
        if(this.fraccion) this.fraccion = this.fraccion.trim();
        if(this.numeroRegistroSanitario) this.numeroRegistroSanitario = this.numeroRegistroSanitario.toUpperCase().trim();
        if(this.nombreTitular) this.nombreTitular = this.nombreTitular.toUpperCase().trim();
        if(this.nombreFabricante) this.nombreFabricante = this.nombreFabricante.toUpperCase().trim();
        if(this.nombreIFA) this.nombreIFA = this.nombreIFA.toUpperCase().trim();
        if(this.nombreRubro) this.nombreRubro = this.nombreRubro.toUpperCase().trim();
        if(this.situacion) this.situacion = this.situacion.toUpperCase().trim();
    }
}
