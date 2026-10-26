import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Readable } from 'node:stream';

@Injectable()
export class StorageService implements OnModuleInit {
  private s3Client: S3Client;
  private readonly bucketName = process.env.MINIO_BUCKET || 'impacta-assets';

  onModuleInit() {
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '9000';

    this.s3Client = new S3Client({
      endpoint: `${protocol}://${endpoint}:${port}`,
      region: process.env.MINIO_REGION || 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      },
    });
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const fileName = `${path}/${Date.now()}-${file.originalname}`;

    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
    } catch (error) {
      let statusCode: number | undefined;
      let errorName: string | undefined;
      if (error && typeof error === 'object') {
        if ('name' in error && typeof error.name === 'string') errorName = error.name;
        if ('$metadata' in error && error.$metadata && typeof error.$metadata === 'object') {
          if (
            'httpStatusCode' in error.$metadata &&
            typeof error.$metadata.httpStatusCode === 'number'
          ) {
            statusCode = error.$metadata.httpStatusCode;
          }
        }
      }
      if (statusCode !== 404 && errorName !== 'NotFound' && errorName !== 'NoSuchBucket') {
        throw error;
      }
      await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentLength: file.size,
        ContentType: file.mimetype,
      }),
    );

    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const host =
      process.env.MINIO_PUBLIC_URL ||
      `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;

    return `${protocol}://${host}/${this.bucketName}/${fileName}`;
  }

  async getFileStream(fileName: string): Promise<Readable> {
    const response = await this.s3Client.send(
      new GetObjectCommand({ Bucket: this.bucketName, Key: fileName }),
    );
    if (!(response.Body instanceof Readable)) {
      throw new Error('Storage response body is not a readable stream');
    }
    return response.Body;
  }
}
