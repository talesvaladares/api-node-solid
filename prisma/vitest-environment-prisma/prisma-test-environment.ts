import { randomUUID } from 'node:crypto';
import { Environment } from 'vitest';
import { execSync  } from 'node:child_process';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variabel.')
  }

  const url = new URL(process.env.DATABASE_URL);

  // "postgresql://docker:docker@localhost:5432/apisolid?schema=public"
  // substitui o schema a url de cima
  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  // eslint-disable-next-line prettier/prettier
  name: 'prisma',
  async setup() {
    
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);
    
    process.env.DATABASE_URL = databaseUrl;

    // executa no terminal o comando abaixo
    // usamos o deploy para que o prisma não compare as migrations e so crie o banco
    execSync('npx prisma migrate deploy');

    return {
      async teardown() {
        // ao final dos teste apaga os bancos
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema} CASCADE"`)
        await prisma.$disconnect();
      }
    }
  }
}