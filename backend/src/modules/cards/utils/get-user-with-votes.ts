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
	userWithVotes: Map<string, number>,
	userToAdd: Map<string, number>
) => {
	if (!userToAdd && userWithVotes) {
		return userWithVotes;
	}

	if (userToAdd && !userWithVotes) {
		return userToAdd;
	}

	for (const [key, value] of userToAdd) {
		if (userWithVotes.has(key)) {
			userWithVotes.set(key, userWithVotes.get(key)! + value);
		} else {
			userWithVotes.set(key, value);
		}
	}

	return userWithVotes;
};
