export const Layers = {
	Spawns: 'spawns',
	Decorations: 'decorations',
	Listeners: 'listeners',
} as const;

export const LayerProperties = {
	Collides: 'collides',
	CollidesDecorationType: 'collides_decorations',
	Depth: 'depth',
} as const;

export const ObjectNames = {
	PlayerSpawn: 'PlayerSpawn',
	FadingListenerType: 'FadingListener',
} as const;

export const ObjectLayerKeys = {
	Spawn: 'spawn',
} as const;
