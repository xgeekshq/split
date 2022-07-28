export function translateBoard(board: any): any {
	const result = JSON.parse(JSON.stringify(board));

	function translate_id(obj) {
		if (obj._id) {
			obj.id = obj._id;
		}
		Object.entries(obj).forEach(([k, v]) => {
			if (k !== '_id') {
				// includes arrays
				if (v !== null && typeof v === 'object') {
					translate_id(v);
				}
			}
		});
	}

	translate_id(result);

	return result;
}

export function fillDividedBoardsUsersWithTeamUsers(board: any): any {
	const teamUsersRole = board.team?.users ?? [];
	function getUserFromTeamById(id) {
		const userRole = teamUsersRole.find((i) => i.user.id === id);
		return userRole
			? {
					...userRole.user
			  }
			: id;
	}

	return {
		...board,
		dividedBoards: [
			...board.dividedBoards.map((db) => ({
				...db,
				users: [
					...db.users.map((u) => ({
						...u,
						user: getUserFromTeamById(String(u.user))
					}))
				]
			}))
		]
	};
}
