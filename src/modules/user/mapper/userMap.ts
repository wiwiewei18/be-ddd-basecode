import { User } from '../domain/user/user';
import { UserEmail } from '../domain/user/userEmail';
import { UserName } from '../domain/user/userName';
import { UserPassword } from '../domain/user/userPassword';
import type { UserDTO } from '../dtos/userDTO';
import type { UserModelSchema } from '../repos/userRepo/user.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMap {
	static toPersistence(user: User): UserModelSchema {
		return {
			userId: user.userId,
			name: user.name.value,
			email: user.email.value,
			password: user.password.getHashedValue(),
		};
	}

	static toDomain(raw: UserModelSchema): User {
		return User.create({
			name: UserName.create(raw.name).getValue(),
			email: UserEmail.create(raw.email).getValue(),
			password: UserPassword.create({
				value: raw.password,
				isHashed: true,
			}).getValue(),
		}).getValue();
	}

	static toDTO(user: User): UserDTO {
		return {
			user_id: user.userId,
			name: user.name.value,
		};
	}
}
