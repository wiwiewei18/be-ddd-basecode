import type { User } from '@modules/user/domain/user/user';
import type { Maybe } from '@shared/core/result';

export interface UserRepo {
	save(user: User): Promise<void>;
	getUserByUserId(userId: string): Promise<Maybe<User>>;
}
