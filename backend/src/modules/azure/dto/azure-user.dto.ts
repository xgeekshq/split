export type AzureUserDTO = {
	id: string;
	mail: string;
	displayName: string;
	userPrincipalName: string;
	createdDateTime: Date;
	accountEnabled: boolean;
	deletedDateTime: Date | null;
	employeeLeaveDateTime: Date | null;
};
