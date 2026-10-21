import { Controller, Get, Param, Res, NotFoundException, Logger } from '@nestjs/common';
import { StorageService } from './storage.service';
import type { Response } from 'express';
import { Public } from '../../auth/decorators/public.decorator';

@Public()
@Controller('assets')
export class StorageController {
  private readonly logger = new Logger(StorageController.name);
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Get('ping')
  async ping() {
    return { status: 'ok', message: 'Storage controller is reachable' };
  }

  @Public()
  @Get('*path')
  async getFile(@Param('path') path: string | string[], @Res() res: Response) {
    const actualPath = Array.isArray(path) ? path.join('/') : path;
    this.logger.debug(`Fetching asset: ${actualPath}`);
    try {
      const stream = await this.storageService.getFileStream(actualPath);

      // Headers de caché para mejorar el rendimiento
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      // Content-Type dinámico
      if (actualPath.endsWith('.png'))
        res.setHeader('Content-Type', 'image/png');
      else if (actualPath.endsWith('.jpg') || actualPath.endsWith('.jpeg'))
        res.setHeader('Content-Type', 'image/jpeg');
      else if (actualPath.endsWith('.svg'))
        res.setHeader('Content-Type', 'image/svg+xml');

      stream.pipe(res);
    } catch (error) {
      this.logger.error('Failed to fetch asset', error);
      throw new NotFoundException('Asset not found');
    }
  }
}
