type UseCaseError = {
	message: string;
};

export abstract class _UseCaseError implements UseCaseError {
	readonly message: string;

	constructor(message: string) {
		this.message = message;
	}
}
