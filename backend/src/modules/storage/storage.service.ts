import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly bucketName = process.env.MINIO_BUCKET || 'impacta-assets';

  onModuleInit() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const fileName = `${path}/${Date.now()}-${file.originalname}`;
    
    // Asegurar que el bucket existe
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    // En producción, esto debería retornar la URL pública del CDN o el endpoint de MinIO
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const host = process.env.MINIO_PUBLIC_URL || `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;
    
    return `${protocol}://${host}/${this.bucketName}/${fileName}`;
  }
}
