import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBookDto {
    @ApiProperty({ example: 'Cien años de soledad' })
    @IsString()
    @MinLength(1)
    title!: string;

    @ApiPropertyOptional({ example: 'Una historia familiar...' })
    @IsOptional()
    @IsString()
    synopsis?: string;

    @ApiProperty({ example: 'Gabriel García Márquez' })
    @IsString()
    @MinLength(1)
    author!: string;

    @ApiProperty({ example: 1967 })
    @IsInt()
    publicationYear!: number;

    @ApiProperty({ example: 'Realismo Mágico' })
    @IsString()
    @MinLength(1)
    genre!: string;

    @ApiPropertyOptional({ example: 'Editorial Sudamericana' })
    @IsOptional()
    @IsString()
    publisher?: string;
}