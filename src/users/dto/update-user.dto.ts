import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Juan Actualizado' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: 'nuevo@correo.com' })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiPropertyOptional({ example: 'activo' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ example: 'uuid-del-rol' })
  @IsOptional()
  @IsString()
  idRol?: string;
}
