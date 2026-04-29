import { Module } from '@nestjs/common';
import { DigemidService } from './digemid.service';
import { DigemidController } from './digemid.controller';
import { Digemid } from './entities/digemid.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [DigemidController],
    providers: [DigemidService],
    imports: [TypeOrmModule.forFeature([Digemid])],
    exports: [
        TypeOrmModule
    ]
})
export class DigemidModule { }
