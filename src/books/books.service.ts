import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const LIST_CACHE_KEY = 'books:list';

@Injectable()
export class BooksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) { }

    async create(dto: CreateBookDto) {
        const book = await this.prisma.book.create({ data: dto });
        await this.redis.del(LIST_CACHE_KEY); // la lista cambió → invalida
        return book;
    }

    async findAll() {
        // 1) ¿está en caché?
        const cached = await this.redis.get<unknown[]>(LIST_CACHE_KEY);
        if (cached) return cached;

        // 2) no está → base de datos
        const books = await this.prisma.book.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // 3) guarda para la próxima (30 segundos)
        await this.redis.set(LIST_CACHE_KEY, books, 30);
        return books;
    }

    async findOne(id: string) {
        const book = await this.prisma.book.findUnique({ where: { id } });
        if (!book) throw new NotFoundException(`Libro ${id} no existe`);
        return book;
    }

    async update(id: string, dto: UpdateBookDto) {
        await this.findOne(id); // 404 si no existe
        const book = await this.prisma.book.update({ where: { id }, data: dto });
        await this.redis.del(LIST_CACHE_KEY);
        return book;
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.book.delete({ where: { id } });
        await this.redis.del(LIST_CACHE_KEY);
        return { deleted: true };
    }
}