import { ObjectId } from 'mongoose';
import User from 'src/modules/users/entities/user.schema';

//returns Map with the users and the amount of votes
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

//Merge 2 users With votes in 1 Map
export const mergeTwoUsersWithVotes = (
	userWithVotes1: Map<string, number>,
	userWithVotes2: Map<string, number>
) => {
	if (!userWithVotes1 && userWithVotes2) {
		return userWithVotes2;
	}

	if (userWithVotes1 && !userWithVotes2) {
		return userWithVotes1;
	}

	for (const [key, value] of userWithVotes1) {
		if (userWithVotes2.has(key)) {
			userWithVotes2.set(key, userWithVotes2.get(key)! + value);
		} else {
			userWithVotes2.set(key, value);
		}
	}

	return userWithVotes2;
};
