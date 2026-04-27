import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseStatusPipe } from 'src/common/pipes/parse-status.pipe';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Get()
    async findAll(
        @Query() paginationDto: PaginationDto
    ) {
        return await this.usersService.findAll(paginationDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.remove(id);
    }

    @Patch(':id/reset-password')
    async resetPassword(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.resetPassword(id);
    }

    @Patch(':id/:status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Param('status', ParseStatusPipe) status: string
    ) {
        return await this.usersService.updateStatus(id, status as unknown as boolean);
    }
}
