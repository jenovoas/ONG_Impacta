import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

function validateRequiredEnv(): void {
  const isProd = process.env.NODE_ENV === 'production';

  // JWT_SECRET: en producción es OBLIGATORIO (no hay fallback).
  // En dev usamos el fallback hardcodeado para no romper tests locales.
  const jwtSecret = process.env.JWT_SECRET;
  if (isProd && (!jwtSecret || jwtSecret === 'super-secret-key-123-change-me-in-production')) {
    logger.error(
      'JWT_SECRET no configurado o usa el valor por omisión. Refuse to boot en producción. ' +
      'Set process.env.JWT_SECRET antes de iniciar.',
    );
    process.exit(1);
  }
  if (!jwtSecret) {
    logger.warn(
      'JWT_SECRET no está configurado; usando fallback hardcodeado (SOLO DEV). ' +
      'En producción esto aborta el boot.',
    );
  }

  // Database URL: ya lo valida Prisma al primer query, pero fallar acá es más útil.
  if (!process.env.DATABASE_URL && isProd) {
    logger.error('DATABASE_URL no configurado en producción. Refuse to boot.');
    process.exit(1);
  }
}

async function bootstrap(): Promise<void> {
  validateRequiredEnv();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Impacta+ backend listening on :${port} (NODE_ENV=${process.env.NODE_ENV ?? 'development'})`);
}

bootstrap();
