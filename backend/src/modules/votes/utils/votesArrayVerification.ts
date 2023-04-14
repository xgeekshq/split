import { arrayIdToString } from 'src/libs/utils/arrayIdToString';

export function votesArrayVerification(votes: string[], userId: string) {
	return arrayIdToString(votes).includes(userId);
}
