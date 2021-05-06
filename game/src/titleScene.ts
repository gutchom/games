import createGameScene from './gameScene'

export default function createTitleScene(): g.Scene {
  const scene = new g.Scene({
    game: g.game,
    assetIds: [
      'title',
      'title_bg',
      'monster',
    ],
  });

  scene.onLoad.add(() => {
    const bgLayer = new g.E({ scene });
    const mainLayer = new g.E({ scene });
    const hudLayer = new g.E({ scene });
    scene.append(bgLayer);
    scene.append(mainLayer);
    scene.append(hudLayer);

    const titlePosY = 280;
    const titleMoveWidth = 24;
    const title = new g.Sprite({
      scene,
      parent: hudLayer,
      src: scene.asset.getImageById('title'),
      anchorX: 0.5,
      x: g.game.width / 2,
      y: titlePosY,
    });

    const background = new g.Sprite({
      scene,
      parent: bgLayer,
      src: scene.asset.getImageById('title_bg'),
      x: 0,
      y: 0,
    });

    scene.onUpdate.add(() => {
      /* 背景のスクロール */
      background.x -= 0.5;
      if (background.x <= -background.width + g.game.width) {
        background.x = 0;
      }
      background.modified();

      /* タイトルをふわふわ動かす */
      title.y = titlePosY - titleMoveWidth * Math.abs(Math.sin(5 * g.game.age / 180 * Math.PI));
      title.modified();
    });

    scene.onPointDownCapture.add(() => {
      g.game.replaceScene(createGameScene(1));
    })
  });

  return scene;
}
