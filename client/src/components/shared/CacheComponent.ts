import { Game } from '@main';

/**
 * Главный смысл этого компонента - снхронизировать кэши **localstorage** и **Phaser.Cache.CacheComponent**
 * относительно имени этого **CacheComponent** (cacheKey)
 */
export class CacheComponent {
	public readonly cache!: Phaser.Cache.BaseCache;
	public readonly cacheKey!: string;
	public localStorageFlag!: boolean;

	private alwaysSave!: boolean;

	constructor(cacheKey?: string) {
		const cacheManager = Game.cache;
		this.cacheKey = cacheKey ?? crypto.randomUUID();
		if (!cacheManager.custom[this.cacheKey]) {
			cacheManager.addCustom(this.cacheKey);
		}

		this.cache = cacheManager.custom[this.cacheKey];
		this.tryLoadingCache();
	}

	public setSettings(settings: { alwaysSave?: boolean }): CacheComponent {
		if (settings?.alwaysSave) {
			this.alwaysSave = settings.alwaysSave;
		}
		return this;
	}

	public add<T extends object>(key: string, data: T): CacheComponent {
		this.cache.add(key, data);
		if (this.alwaysSave) this.save();
		return this;
	}

	public remove(key: string): CacheComponent {
		this.cache.remove(key);
		if (this.alwaysSave) this.save();
		return this;
	}

	public get<T extends object>(key: string): T | undefined {
		return this.cache.get(key) as T;
	}

	public exists(key: string): boolean {
		return this.cache.exists(key);
	}

	public clear(): void {
		Object.entries(this.cache.entries.entries).forEach(([key, _]) => {
			this.remove(key);
		});
	}

	public save(): CacheComponent {
		// делаем снимок нашего кэша и сохраняем его в localstorage (перезаписываем то что было до этого в localstorage)
		localStorage.setItem(this.cacheKey, JSON.stringify(this.cache.entries.entries));
		return this;
	}

	private tryLoadingCache(): void {
		const cacheEntry = localStorage.getItem(this.cacheKey);
		if (cacheEntry) {
			this.localStorageFlag = true;
			Object.entries(JSON.parse(cacheEntry) as object).forEach(([key, value]) => {
				this.add(key, value);
			});
		}
	}
}
