import { ObjectId } from 'mongoose';
import User from 'src/modules/users/entities/user.schema';

export const getUserWithVotes = (votes: string[] | User[] | ObjectId[]): Map<string, number> => {
	const votesByUser = new Map<string, number>();
	votes.forEach((userId) => {
		if (!votesByUser.has(userId.toString())) {
			votesByUser.set(userId.toString(), 1);
		} else {
			const count = votesByUser.get(userId.toString());
			votesByUser.set(userId.toString(), count + 1);
		}
	});

	return votesByUser;
};
