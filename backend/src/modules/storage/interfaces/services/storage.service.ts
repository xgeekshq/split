import { BlobDeleteResponse } from '@azure/storage-blob';

export interface StorageServiceInterface {
	uploadFile(
		fileName: string,
		file: { originalname: string; buffer: Buffer; mimetype: string },
		containerName?: string
	): Promise<string>;
	deleteFile(fileUrl: string, containerName?: string): Promise<void | BlobDeleteResponse>;
}
