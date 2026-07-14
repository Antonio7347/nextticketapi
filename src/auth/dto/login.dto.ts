import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juan@correo.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'miPassword123' })
  @IsString()
  contrasena: string;
}
