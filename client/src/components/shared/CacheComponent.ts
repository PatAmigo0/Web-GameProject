import { Game } from '@main';

export class CacheComponent {
	public readonly cache: Phaser.Cache.BaseCache;
	public readonly cacheKey: string;

	constructor(cacheKey?: string) {
		const cacheManager = Game.cache;

		this.cacheKey = cacheKey ?? crypto.randomUUID();
		if (!cacheManager.custom[this.cacheKey]) {
			cacheManager.addCustom(this.cacheKey);
		}

		this.cache = cacheManager.custom[this.cacheKey];
	}

	add<T>(key: string, data: T): void {
		this.cache.add(key, data);
	}

	get<T>(key: string): T | undefined {
		return this.cache.get(key) as T;
	}

	exists(key: string): boolean {
		return this.cache.exists(key);
	}

	remove(key: string) {
		return this.cache.remove(key);
	}
}
