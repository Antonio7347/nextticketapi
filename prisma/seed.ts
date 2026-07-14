import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '.prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // ─── 1. Roles ───────────────────────────────────────────
  const rolCliente = await prisma.rol.upsert({
    where: { idRol: 'rol-cliente' },
    update: {},
    create: {
      idRol: 'rol-cliente',
      nombre: 'cliente',
      descripcion: 'Usuario que compra boletos para eventos',
    },
  });

  const rolOrganizador = await prisma.rol.upsert({
    where: { idRol: 'rol-organizador' },
    update: {},
    create: {
      idRol: 'rol-organizador',
      nombre: 'organizador',
      descripcion: 'Usuario que crea y administra eventos',
    },
  });

  const rolAdmin = await prisma.rol.upsert({
    where: { idRol: 'rol-admin' },
    update: {},
    create: {
      idRol: 'rol-admin',
      nombre: 'admin',
      descripcion: 'Administrador general de la plataforma',
    },
  });

  const rolValidador = await prisma.rol.upsert({
    where: { idRol: 'rol-validador' },
    update: {},
    create: {
      idRol: 'rol-validador',
      nombre: 'validador',
      descripcion: 'Valida boletos en la entrada de los eventos',
    },
  });

  console.log('✅ Roles creados:', [rolCliente.nombre, rolOrganizador.nombre, rolAdmin.nombre, rolValidador.nombre]);

  // ─── 2. Usuarios de prueba ──────────────────────────────
  const hash = await bcrypt.hash('password123', 10);

  const userCliente = await prisma.usuario.upsert({
    where: { correo: 'cliente@nextticket.com' },
    update: {},
    create: {
      idUsuario: 'user-cliente-001',
      nombre: 'Carlos Cliente',
      correo: 'cliente@nextticket.com',
      contrasena: hash,
      idRol: rolCliente.idRol,
      estado: 'activo',
    },
  });

  const userOrganizador = await prisma.usuario.upsert({
    where: { correo: 'organizador@nextticket.com' },
    update: {},
    create: {
      idUsuario: 'user-organizador-001',
      nombre: 'Omar Organizador',
      correo: 'organizador@nextticket.com',
      contrasena: hash,
      idRol: rolOrganizador.idRol,
      estado: 'activo',
    },
  });

  const userAdmin = await prisma.usuario.upsert({
    where: { correo: 'admin@nextticket.com' },
    update: {},
    create: {
      idUsuario: 'user-admin-001',
      nombre: 'Ana Admin',
      correo: 'admin@nextticket.com',
      contrasena: hash,
      idRol: rolAdmin.idRol,
      estado: 'activo',
    },
  });

  console.log('✅ Usuarios creados:', [userCliente.nombre, userOrganizador.nombre, userAdmin.nombre]);

  // ─── 3. Recinto de prueba ───────────────────────────────
  const recinto = await prisma.recinto.upsert({
    where: { idRecinto: 'recinto-001' },
    update: {},
    create: {
      idRecinto: 'recinto-001',
      nombre: 'Arena NextTicket',
      direccion: 'Av. Principal 123, Col. Centro',
      ciudad: 'Cuernavaca',
      capacidadTotal: 5000,
      descripcion: 'Arena principal para eventos de gran escala',
      estado: 'activo',
    },
  });

  console.log('✅ Recinto creado:', recinto.nombre);

  // ─── 4. Zonas del recinto ──────────────────────────────
  const zonaVip = await prisma.zona.upsert({
    where: { idZona: 'zona-vip-001' },
    update: {},
    create: {
      idZona: 'zona-vip-001',
      idRecinto: recinto.idRecinto,
      nombre: 'VIP',
      descripcion: 'Zona preferencial con vista directa al escenario',
      capacidad: 200,
      precioBase: 1500.00,
      colorMapa: '#7c3aed',
      estado: 'activo',
    },
  });

  const zonaGeneral = await prisma.zona.upsert({
    where: { idZona: 'zona-general-001' },
    update: {},
    create: {
      idZona: 'zona-general-001',
      idRecinto: recinto.idRecinto,
      nombre: 'General',
      descripcion: 'Zona de acceso general',
      capacidad: 4800,
      precioBase: 500.00,
      colorMapa: '#3b82f6',
      estado: 'activo',
    },
  });

  console.log('✅ Zonas creadas:', [zonaVip.nombre, zonaGeneral.nombre]);

  // ─── 5. Asientos de prueba (6 VIP + 6 General) ────────
  const asientos: {
    idAsiento: string;
    idZona: string;
    fila: string;
    numero: string;
    tipo: string;
    coordenadaX: number;
    coordenadaY: number;
    estado: string;
  }[] = [];
  for (let fila = 1; fila <= 2; fila++) {
    for (let num = 1; num <= 3; num++) {
      asientos.push({
        idAsiento: `asiento-vip-F${fila}-${num}`,
        idZona: zonaVip.idZona,
        fila: `F${fila}`,
        numero: `${num}`,
        tipo: 'vip',
        coordenadaX: num * 50,
        coordenadaY: fila * 50,
        estado: 'disponible',
      });
      asientos.push({
        idAsiento: `asiento-gen-F${fila}-${num}`,
        idZona: zonaGeneral.idZona,
        fila: `G${fila}`,
        numero: `${num}`,
        tipo: 'general',
        coordenadaX: num * 50,
        coordenadaY: (fila + 3) * 50,
        estado: 'disponible',
      });
    }
  }

  for (const a of asientos) {
    await prisma.asiento.upsert({
      where: { idAsiento: a.idAsiento },
      update: {},
      create: a,
    });
  }

  console.log(`✅ ${asientos.length} asientos creados`);

  // ─── 6. Evento de prueba ───────────────────────────────
  const evento = await prisma.evento.upsert({
    where: { idEvento: 'evento-001' },
    update: {},
    create: {
      idEvento: 'evento-001',
      idRecinto: recinto.idRecinto,
      idOrganizador: userOrganizador.idUsuario,
      nombre: 'Concierto de Inauguración NextTicket',
      fechaHora: new Date('2026-08-15T20:00:00'),
      imagen: 'https://placehold.co/800x400/7c3aed/ffffff?text=NextTicket+Inaugural',
      descripcion: 'Gran evento de inauguración de la plataforma NextTicket con artistas invitados.',
      estado: 'activo',
    },
  });

  console.log('✅ Evento creado:', evento.nombre);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('────────────────────────────────────────');
  console.log('Usuarios de prueba (contraseña: password123):');
  console.log('  📧 cliente@nextticket.com      (rol: cliente)');
  console.log('  📧 organizador@nextticket.com  (rol: organizador)');
  console.log('  📧 admin@nextticket.com        (rol: admin)');
  console.log('────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
