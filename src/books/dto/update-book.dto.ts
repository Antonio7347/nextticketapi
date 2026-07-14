import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBookDto {
    @ApiPropertyOptional({ example: 'Cien años de soledad' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;

    @ApiPropertyOptional({ example: 'Una historia familiar...' })
    @IsOptional()
    @IsString()
    synopsis?: string;

    @ApiPropertyOptional({ example: 'Gabriel García Márquez' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    author?: string;

    @ApiPropertyOptional({ example: 1967 })
    @IsOptional()
    @IsInt()
    publicationYear?: number;

    @ApiPropertyOptional({ example: 'Realismo Mágico' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    genre?: string;

    @ApiPropertyOptional({ example: 'Editorial Sudamericana' })
    @IsOptional()
    @IsString()
    publisher?: string;
}