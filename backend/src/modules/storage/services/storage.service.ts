import { BlobDeleteResponse, BlobServiceClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONNECTION_STRING } from 'src/libs/constants/storage';
import { StorageServiceInterface } from '../interfaces/services/storage.service';
import { ContainerNameEnum } from '../interfaces/types';

@Injectable()
export class StorageService implements StorageServiceInterface {
	private blobServiceClient: BlobServiceClient;

	constructor(private readonly configService: ConfigService, private readonly logger: Logger) {
		const connectionString = this.configService.get(CONNECTION_STRING);

		this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
	}

	async uploadFile(
		fileName: string,
		file: { originalname: string; buffer: Buffer; mimetype: string },
		containerName = ContainerNameEnum.SPLIT_IMAGES
	): Promise<string> {
		const containerClient = this.blobServiceClient.getContainerClient(containerName);

		const fileExtension = file.originalname.split('.').pop();
		const blobClient = containerClient.getBlockBlobClient(`${fileName}.${fileExtension}`);

		await blobClient
			.upload(file.buffer, file.buffer.length, {
				blobHTTPHeaders: {
					blobContentType: file.mimetype
				}
			})
			.catch((err) => {
				this.logger.error(err);
			});

		return blobClient.url;
	}

	deleteFile(
		fileUrl: string,
		containerName = ContainerNameEnum.SPLIT_IMAGES
	): Promise<void | BlobDeleteResponse> {
		const containerClient = this.blobServiceClient.getContainerClient(containerName);

		const fileName = fileUrl.split('/').pop();
		const blobClient = containerClient.getBlockBlobClient(fileName);

		return blobClient.delete().catch((err) => {
			this.logger.error(err);
		});
	}
}
