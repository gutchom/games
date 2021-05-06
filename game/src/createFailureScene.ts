import { Score } from './GameCore'
import createTitleScene from './createTitleScene'
import createButton from './createButton'

export default function createFailureScene(score: Score, ...messages: string[]): g.Scene {
  const scene = new g.Scene({
    game: g.game,
    assetIds: [
      'font12',
      'font12_glyphs',
    ],
  });

  scene.onLoad.add(() => {
    const font = new g.BitmapFont({
      src: scene.asset.getImageById('font12'),
      glyphInfo: JSON.parse(scene.asset.getTextById('font12_glyphs').data),
    });
    scene.append(new g.FilledRect({
      scene,
      cssColor: 'black',
      width: g.game.width,
      height: g.game.height,
    }));
    scene.append(new g.Label({
      scene,
      font,
      text: `プレイ時間: ${score.time}秒`,
      textColor: 'white',
      fontSize: 32,
      x: 400,
      y: 500,
    }));
    scene.append(new g.Label({
      scene,
      font,
      text: `飲んだ本数: ${score.count}本`,
      textColor: 'white',
      fontSize: 32,
      x: 400,
      y: 532,
    }));
    messages.forEach((message, i) => {
      scene.append(new g.Label({
        scene,
        font,
        text: message,
        textColor: 'red',
        fontSize: 64,
        x: 200,
        y: 300 + i * 64,
      }));
    });

    scene.onPointDownCapture.add(() => {
      g.game.replaceScene(createTitleScene());
    })
  });

  return scene;
}
