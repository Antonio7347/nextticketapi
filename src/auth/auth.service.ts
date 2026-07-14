import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // ─── REGISTRO ───────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // Verificar que el correo no exista
    const exists = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });
    if (exists) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Buscar rol "cliente" por defecto
    const rolCliente = await this.prisma.rol.findFirst({
      where: { nombre: 'cliente' },
    });

    // Hashear contraseña
    const hash = await bcrypt.hash(dto.contrasena, 10);

    // Crear usuario
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        correo: dto.correo,
        contrasena: hash,
        idRol: rolCliente?.idRol ?? null,
        estado: 'activo',
      },
      include: { rol: true },
    });

    // Generar token
    const token = this.generateToken(usuario);

    return {
      message: 'Usuario registrado exitosamente',
      user: this.sanitize(usuario),
      access_token: token,
    };
  }

  // ─── LOGIN ──────────────────────────────────────────────────
  async login(dto: LoginDto) {
    // Buscar usuario por correo
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
      include: { rol: true },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar contraseña
    const passwordValid = await bcrypt.compare(
      dto.contrasena,
      usuario.contrasena,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token
    const token = this.generateToken(usuario);

    return {
      message: 'Login exitoso',
      user: this.sanitize(usuario),
      access_token: token,
    };
  }

  // ─── HELPERS ────────────────────────────────────────────────
  private generateToken(usuario: { idUsuario: string; correo: string; rol?: { nombre: string } | null }) {
    const payload = {
      sub: usuario.idUsuario,
      email: usuario.correo,
      rol: usuario.rol?.nombre ?? 'cliente',
    };
    return this.jwt.sign(payload);
  }

  private sanitize(usuario: Record<string, unknown>) {
    const { contrasena: _, ...safe } = usuario;
    return safe;
  }
}
