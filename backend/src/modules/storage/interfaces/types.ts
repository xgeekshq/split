export const TYPES = {
	services: {
		StorageService: 'StorageService'
	}
};

export enum ContainerNameEnum {
	SPLIT_IMAGES = 'split-images'
}

export type ContainerName = `${ContainerNameEnum}`;
