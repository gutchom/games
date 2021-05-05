export = function main() {
	let isGameOver = false;
	const font = new g.DynamicFont({
		game: g.game,
		fontFamily: "sans-serif",
		size: 64,
	});
	const scene = new g.Scene({ game: g.game, assetIds: [
			'bg01',
			'player',
			'monster',
		]});
	scene.onLoad.add(() => {
		const background = new g.Sprite({
			scene,
			src: scene.asset.getImageById('bg01'),
			x: -200,
		});
		scene.append(background);

		const awake = new g.FilledRect({
			scene,
			cssColor: 'lime',
			width: 500,
			height: 32,
			x: 32,
			y: 32,
		});
		scene.append(awake);

		const caffeine = new g.FilledRect({
			scene,
			cssColor: 'yellow',
			width: 0,
			height: 32,
			x: 32,
			y: 64,
		});
		scene.append(caffeine);

		const player = new g.Sprite({
			scene,
			src: scene.asset.getImageById('player'),
			width: scene.asset.getImageById('player').width,
			height: scene.asset.getImageById('player').height,
			x: scene.asset.getImageById('bg01').height / 2,
			y: scene.asset.getImageById('bg01').height - scene.asset.getImageById('player').height - scene.asset.getImageById('bg01').height / 5,
		});
		scene.append(player);

		scene.onPointDownCapture.add((e) => {
			player.x = e.point.x;
			player.modified();
		});
		scene.onPointMoveCapture.add((e) => {
			player.x = e.point.x + e.startDelta.x;
			player.modified();
		});
		scene.onPointUpCapture.add((e) => {
			player.x = e.point.x + e.startDelta.x;
			player.modified();
		});

		function generateMonster() {
			const monster = new g.Sprite({
				scene,
				src: scene.asset.getImageById('monster'),
				x: Math.floor(g.game.random.generate() * g.game.width),
				y: 0,
			});
			monster.onUpdate.add(() => {
				if (monster.y > scene.asset.getImageById('bg01').height) {
					monster.destroy();
				}
				if (intersectArea(monster, player)) {
					caffeine.width += 80;
					caffeine.modified();
					awake.width += 20;
					awake.modified();
					monster.destroy();
				}
				monster.y += 5 + monster.y * 0.05;
				monster.modified();
			});
			scene.append(monster);
		}
		scene.onUpdate.add(() => {
			if (awake.width > 0) {
				awake.width -= 1;
				awake.modified();
			}
			if (caffeine.width > 0) {
				caffeine.width -= 5;
				caffeine.modified();
			}
			if (!isGameOver && g.game.age % 10 === 0) {
				generateMonster();
			}
			if (caffeine.width > awake.width) {
				scene.append(new g.FilledRect({
					scene,
					cssColor: 'black',
					width: g.game.width,
					height: g.game.height,
				}));
				scene.append(new g.Label({
					scene,
					font,
					text: 'カフェイン中毒になりました',
					textColor: 'red',
					x: 200,
					y: 300,
				}));
				isGameOver = true;
			}
			if (awake.width > 1000) {
				scene.append(new g.FilledRect({
					scene,
					cssColor: 'white',
					width: g.game.width,
					height: g.game.height,
				}));
				scene.append(new g.Label({
					scene,
					font,
					text: '起床成功！',
					textColor: 'red',
					x: 400,
					y: 300,
				}));
				isGameOver = true;
			}
		})
	});
	g.game.pushScene(scene);
};

interface Area {
	x: number;
	y: number;
	width: number;
	height: number;
}
function intersectArea(a: Area, b: Area): boolean {
	return a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
}
