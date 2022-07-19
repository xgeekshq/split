import { UserType } from 'modules/communication/dto/types';

export class UserDto {
	id: string;

	email: string;

	firstName: string;

	lastName: string;

	responsible: boolean;

	boardId?: string;

	slackId?: string;

	constructor(
		id: string,
		firstName: string,
		lastName: string,
		email: string,
		responsible = false,
		boardId?: string,
		slackId?: string
	) {
		this.id = id;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.responsible = responsible;
		this.boardId = boardId;
		this.slackId = slackId;
	}

	public static FromUser(user: UserType, isResponsible: boolean) {
		return new this(
			user.id,
			user.firstName,
			user.lastName,
			user.email || '',
			isResponsible,
			user.board
		);
	}
}
