import { PartialType } from '@nestjs/swagger';
import { CreateDigemidDto } from './create-digemid.dto';

export class UpdateDigemidDto extends PartialType(CreateDigemidDto) {}
