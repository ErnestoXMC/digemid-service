import { User } from "src/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum RoleCode {
    ADMIN = 'ADMIN',
    SOPORTE = 'SOPORTE',
    DESARROLLO = 'DESARROLLO',
}

@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: RoleCode,
        unique: true
    })
    code: RoleCode;

    @Column('varchar', {
        length: 250
    })
    name: string;

    @Column('text')
    description: string;

    @Column('boolean', {
        default: true
    })
    isActive: boolean;

    //* Relaciones
    @OneToMany(
        () => User,
        (user) => user.role
    )
    users: User[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    sanitizarCampos() {
        if (this.name) this.name = this.name.trim();
        if (this.description) this.description = this.description.trim();
    }
    
}
