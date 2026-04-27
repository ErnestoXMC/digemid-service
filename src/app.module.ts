import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DigemidModule } from './digemid/digemid.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PeopleModule } from './people/people.module';

@Module({
    imports: [

        ConfigModule.forRoot(),

        //* Conexion a bd_maestra (solo tabla tenants)
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT!,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            
            //* Intentos de conexion a nuestra bd (default: 10)
            retryAttempts: 5,

            //! Deshabilitarlo al entrar a produccion
            synchronize: true,
        }),

        AuthModule,

        DigemidModule,

        UsersModule,

        RolesModule,

        PeopleModule,

    ]
})
export class AppModule { }
