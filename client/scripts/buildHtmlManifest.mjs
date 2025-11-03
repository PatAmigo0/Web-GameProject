import fs from 'fs';
import path from 'path';

const CWD = process.cwd();
const HTML_DIR = path.join(CWD, '/public/html');
const CSS_DIR = path.join(CWD, '/public/styles');
const OUTPUT_DIR = path.join(
	CWD,
	'/public/assets/manifests/html-manifest.json',
);

try {
	const htmlFiles = fs
		.readdirSync(HTML_DIR)
		.filter((filename) => filename.endsWith('.html'));

	const cssFiles = fs
		.readdirSync(CSS_DIR)
		.filter((filename) => filename.endsWith('.css'));

	// помещаем все css файлы в карту для удобно поиска вместо использования fs.existsSync
	const cssFilesMap = {};
	cssFiles.forEach(
		(cssFileName) => (cssFilesMap[cssFileName.replace('.css', '')] = true),
	);

	// мы ищем сходства между css и html, если у html нет своего css стиля, то он не валидный
	// и не входит в конечный манифест
	const avaliableHtml = {};
	htmlFiles.forEach((htmlFileName) => {
		const fileKey = htmlFileName.replace('.html', '');
		if (fs.existsSync(path.join(CSS_DIR, `${fileKey}.css`))) {
			avaliableHtml[fileKey] = true;
		}
	});

	const htmlManifest = {};
	for (const fileName in avaliableHtml) {
		const fileNameUpperCase = fileName[0].toUpperCase() + fileName.slice(1); // Имя сцены в src без .ts расширения
		htmlManifest[fileNameUpperCase] = {
			CSS: fileName + '.css',
			HTML: fileName + '.html',
		};
	}

	fs.writeFileSync(OUTPUT_DIR, JSON.stringify(htmlManifest, null, 2));
	console.log('[ Html manifest ] был успешно создан!');
} catch (e) {
	console.log(
		`[ Html manifest ] во время создания манифеста произошла ошибка: ${e}`,
	);
	process.exit(1);
}
