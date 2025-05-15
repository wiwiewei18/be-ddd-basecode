import jwtClient from 'jsonwebtoken';
import type { AuthService, SignedJWT } from './authService';

export type AuthConfig = {
	jwt: JWTConfig;
};

type JWTConfig = {
	secret: string;
	tokenExpirationInMinute: number;
};

export class JWTAuthService implements AuthService {
	constructor(private authConfig: AuthConfig) {}

	signJWT<T>(claims: T): SignedJWT {
		const expiryTimestamp =
			Math.floor(Date.now() / 1000) + 60 * this.authConfig.jwt.tokenExpirationInMinute;

		const token = jwtClient.sign(
			{
				exp: expiryTimestamp,
				...claims,
			},
			this.authConfig.jwt.secret,
		);

		return {
			token,
			expires: new Date(expiryTimestamp * 1000),
		};
	}

	decodeJWT<T>(jwt: string): Promise<T> {
		throw new Error('Method not implemented.');
	}
	isJWTValidated(jwt: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	isJWTExpired(jwt: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
}
