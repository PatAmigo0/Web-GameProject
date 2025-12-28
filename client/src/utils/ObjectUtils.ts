export class ObjectUtils {
	public static freezeProperty(object: Object, propertyKey: string) {
		Object.defineProperty(object, propertyKey, {
			enumerable: false,
			writable: false,
			configurable: false,
		});
	}
}
