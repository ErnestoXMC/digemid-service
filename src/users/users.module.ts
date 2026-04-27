import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        TypeOrmModule.forFeature([User]),
        PeopleModule,
        RolesModule
    ],
    exports: [TypeOrmModule]
})
export class UsersModule { }
