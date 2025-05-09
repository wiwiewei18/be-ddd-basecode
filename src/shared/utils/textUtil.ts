// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TextUtil {
	static getRandomText(length: number) {
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let text = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length);
			text += charset.charAt(randomIndex);
		}

		return text;
	}
}
