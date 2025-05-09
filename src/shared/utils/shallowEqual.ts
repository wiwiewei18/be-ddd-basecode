type Object = Record<string, unknown>;

export function shallowEqual(objOne: Object, objTwo: Object) {
	if (Object.keys(objOne).length !== Object.keys(objTwo).length) return false;

	for (const key in objOne) {
		if (!Object.hasOwn(objTwo, key)) return false;

		if (objOne[key] !== objTwo[key]) return false;
	}

	return true;
}
