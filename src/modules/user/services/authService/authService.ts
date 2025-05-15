export type SignedJWT = {
	token: string;
	expires: Date;
};

export interface AuthService {
	signJWT<T>(claims: T): SignedJWT;
	decodeJWT<T>(jwt: string): Promise<T>;
	isJWTValidated(jwt: string): Promise<boolean>;
	isJWTExpired(jwt: string): Promise<boolean>;
}
