import { LeanDocument } from 'mongoose';

import { UserDocument } from '../../schemas/user.schema';

export interface GetUserApplication {
	getByEmail(email: string): Promise<LeanDocument<UserDocument> | null>;

	countUsers(): Promise<number>;
}
