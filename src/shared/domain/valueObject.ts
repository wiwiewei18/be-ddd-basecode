import { shallowEqual } from '@shared/utils/shallowEqual';

type ValueObjectProps = Record<string, unknown>;

export abstract class ValueObject<T extends ValueObjectProps> {
	props: T;

	constructor(props: T) {
		const baseProps = { ...props };

		this.props = baseProps;
	}

	equals(object?: ValueObject<T>): boolean {
		if (object === null || object === undefined) {
			return false;
		}

		if (object.props === undefined) {
			return false;
		}

		return shallowEqual(this.props, object.props);
	}
}
