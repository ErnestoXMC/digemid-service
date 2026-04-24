import { Module } from '@nestjs/common';
import { DigemidService } from './digemid.service';
import { DigemidController } from './digemid.controller';

@Module({
  controllers: [DigemidController],
  providers: [DigemidService],
})
export class DigemidModule {}
