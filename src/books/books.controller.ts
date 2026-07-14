import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
    constructor(private readonly books: BooksService) { }

    @Post()
    @ApiOperation({ summary: 'Crear libro' })
    create(@Body() dto: CreateBookDto) {
        return this.books.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los libros' })
    findAll() {
        return this.books.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener libro por id' })
    @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
    findOne(@Param('id') id: string) {
        return this.books.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar libro' })
    @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
    update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
        return this.books.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar libro' })
    @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
    remove(@Param('id') id: string) {
        return this.books.remove(id);
    }
}