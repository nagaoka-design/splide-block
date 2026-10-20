/**
 * フロント用スクリプト（block.json の viewScript）。
 * Splide はバンドルして使うため window.Splide を汚さず、テーマ側の Splide とは干渉しない。
 * 対象はこのブロックが出力する要素（data-cssmode を持つ .splide）だけ。
 */
import Splide from '@splidejs/splide';

const toInt = (value, fallback) => parseInt(value, 10) || fallback;

function init(element) {
	if (element.dataset.splideBlockReady) {
		return;
	}
	element.dataset.splideBlockReady = 'true';

	const d = element.dataset;

	// 画像の表示方法（object-fit）
	element.querySelectorAll('.splide__slide img').forEach((img) => {
		img.style.display = 'block';
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.objectFit = d.objectfit || 'cover';
	});

	const options = {
		type: d.type || 'loop',
		autoplay: d.autoplay === 'true',
		interval: toInt(d.interval, 3000),
		perPage: toInt(d.perpage, 1),
		gap: d.gap || '1rem',
		padding: d.padding || 0,
		arrows: d.arrows !== 'false',
		pagination: d.pagination !== 'false',
		speed: toInt(d.speed, 400),
		rewind: d.rewind === 'true',
		drag: d.drag !== 'false',
		keyboard: d.keyboard === 'true',
	};

	if (d.height) options.height = d.height;
	if (d.heightratio) options.heightRatio = parseFloat(d.heightratio);
	if (d.fixedwidth) options.fixedWidth = d.fixedwidth;
	if (d.fixedheight) options.fixedHeight = d.fixedheight;
	if (d.mediaquery) options.mediaQuery = d.mediaquery;
	if (d.breakpoints) {
		try {
			options.breakpoints = JSON.parse(d.breakpoints);
		} catch (e) {
			// 不正なJSONは無視
		}
	}

	new Splide(element, options).mount();
}

function initAll() {
	document.querySelectorAll('.splide[data-cssmode]').forEach(init);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
