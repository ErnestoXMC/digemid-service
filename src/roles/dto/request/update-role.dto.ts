import { ApiSchema, OmitType, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

@ApiSchema({ name: 'AdminUpdateRoleDto' })
export class UpdateRoleDto extends PartialType(OmitType(CreateRoleDto, ['code'] as const)) {}
