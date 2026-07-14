import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'juan@correo.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'miPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  contrasena: string;
}
