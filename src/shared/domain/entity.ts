import { randomUUID } from 'node:crypto';

export abstract class Entity<T> {
	protected readonly _id: string;
	readonly props: T;

	constructor(props: T, id?: string) {
		this._id = id || randomUUID();
		this.props = props;
	}

	equals(object?: Entity<T>): boolean {
		if (object === null || object === undefined) {
			return false;
		}

		if (this === object) {
			return true;
		}

		if (!this.isEntity(object)) {
			return false;
		}

		return this._id === object._id;
	}

	private isEntity(v: unknown): v is Entity<unknown> {
		return v instanceof Entity;
	}
}
