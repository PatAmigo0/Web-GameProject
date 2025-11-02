import fs from 'fs';
import path from 'path';

const CWD = process.cwd();
const MAPS_DIR = path.join(CWD, 'public/assets/maps');
const JSON_DIR = path.join(MAPS_DIR, 'json');
const TILESET_DIR = path.join(MAPS_DIR, 'tilesets');
const OUTPUT_DIR = path.join(CWD, 'public/assets/manifest.json');

const assetManifest = {};
try {
	const mapFiles = fs
		.readdirSync(JSON_DIR)
		.filter((filename) => filename.endsWith('json'));

	const mapTilesets = fs
		.readdirSync(TILESET_DIR)
		.filter((filename) => filename.endsWith('png'));

	const avaliableTilesets = {};
	mapTilesets.forEach(
		(filename) => (avaliableTilesets[filename.replace('.png', '')] = true),
	);

	for (const mapFile of mapFiles) {
		const sceneKey = mapFile.replace('.json', '');
		const mapFilePath = path.join(JSON_DIR, mapFile);

		const mapDataStr = fs.readFileSync(mapFilePath, { encoding: 'utf-8' });
		const mapData = JSON.parse(mapDataStr);

		const requiredTilesets = [];
		if (mapData.tilesets) {
			for (const tileset of mapData.tilesets) {
				if (avaliableTilesets[tileset.name]) {
					const webpath = `/assets/maps/tilesets/${tileset.name}.png`;
					requiredTilesets.push(webpath);
				} else
					console.warn(
						`Tileset ${tileset.name} не существует для ${sceneKey}`,
					);
			}
			assetManifest[sceneKey] = {
				mapJsonUrl: `/assets/maps/json/${mapFile}`,
				tilesetUrls: requiredTilesets,
			};
		} else
			console.warn(
				`${mapFile} поврежден и не подлежит правильному чтению`,
			);
	}

	fs.writeFileSync(OUTPUT_DIR, JSON.stringify(assetManifest, null, 2));
	console.log('[ Manifest ] был успешно создан!');
} catch (e) {
	console.error(
		`[ Manifest ] Произошла ошибка во время создание манифеста: ${e}`,
	);
	process.exit(1);
}
