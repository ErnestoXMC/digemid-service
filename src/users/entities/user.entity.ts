import { Exclude } from "class-transformer";
import { Person } from "src/people/entities/person.entity";
import { Role } from "src/roles/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        length: 150,
        unique: true,
        name: 'corporate_email'
    })
    corporateEmail: string;

    @Exclude()
    @Column('varchar', {
        length: 500,
        name: 'password_hash'
    })
    passwordHash: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('timestamp', {
        nullable: true,
        name: 'last_login'
    })
    lastLogin: Date;

    //* Relaciones sin cascade ya que no actualizaremos ninguna otra entidad
    //* eager - joins
    @OneToOne(
        () => Person,
        (person) => person.user,
        {eager: true}
    )
    @JoinColumn({name: 'person_id'})
    person: Person;

    @ManyToOne(
        () => Role,
        (role) => role.users,
        {eager: true}
    )
    @JoinColumn({name: 'role_id'})
    role: Role;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}