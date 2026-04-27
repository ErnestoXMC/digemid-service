import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { PaginationStatusDto } from 'src/common/dto';
import { ParseStatusPipe } from 'src/common/pipes/parse-status.pipe';


@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto) {
        return await this.rolesService.create(createRoleDto);
    }

    @Get()
    async findAll(@Query() paginationStatusDto: PaginationStatusDto) {
        return await this.rolesService.findAll(paginationStatusDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(+id, updateRoleDto);
    }

    @Patch(':id/:status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Param('status', ParseStatusPipe) status: string
    ) {
        //* El cast le dice a TypeScript que confíe en que el pipe ya hizo la conversión.
        return await this.rolesService.updateStatus(id, status as unknown as boolean);
    }
}
