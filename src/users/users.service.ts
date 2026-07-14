import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const usuarios = await this.prisma.usuario.findMany({
      include: { rol: true },
      orderBy: { fechaCreacion: 'desc' },
    });
    return usuarios.map((u) => this.sanitize(u));
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario: id },
      include: { rol: true },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return this.sanitize(usuario);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id); // lanza 404 si no existe
    const usuario = await this.prisma.usuario.update({
      where: { idUsuario: id },
      data: {
        nombre: dto.nombre,
        correo: dto.correo,
        estado: dto.estado,
        idRol: dto.idRol,
      },
      include: { rol: true },
    });
    return this.sanitize(usuario);
  }

  async remove(id: string) {
    await this.findOne(id); // lanza 404 si no existe
    await this.prisma.usuario.delete({
      where: { idUsuario: id },
    });
    return { deleted: true, id };
  }

  private sanitize(usuario: Record<string, unknown>) {
    const { contrasena: _, ...safe } = usuario;
    return safe;
  }
}
