import { User } from "src/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum DocumentType {
    DNI = 'DNI',
    PASSPORT = 'PASSPORT',
    RUC = 'RUC',
}

@Entity('people')
export class Person {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('varchar', {
        length: 250,
        name: 'first_name',
    })
    firstName: string;

    @Column('varchar', {
        length: 250,
        name: 'last_name',
    })
    lastName: string;

    @Column({
        type: 'enum',
        enum: DocumentType,
        name: 'document_type',
    })
    documentType: DocumentType;

    @Column('varchar', {
        length: 20,
        unique: true,
        name: 'document_number',
    })
    documentNumber: string;

    //* Relaciones
    @OneToOne(
        () => User,
        (user) => user.person,
        { cascade: ['soft-remove'] }
    )
    user: User;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    sanitizarDatos() {
        if(this.firstName) this.firstName = this.firstName.trim().toLowerCase();
        if(this.lastName) this.lastName = this.lastName.trim().toLowerCase();
        if(this.documentNumber) this.documentNumber = this.documentNumber.trim();
    }

}

