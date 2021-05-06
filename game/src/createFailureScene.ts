import { Score } from './GameCore'
import createTitleScene from './createTitleScene'
import createButton from './createButton'

export default function createFailureScene(score: Score, ...messages: string[]): g.Scene {
  const scene = new g.Scene({
    game: g.game,
    assetIds: [
      'font12',
      'font12_glyphs',
      'button',
      'button_pressed',
      'Tweet',
      'Retry',
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

    const tweetButton = createButton(scene, new g.Sprite({
      scene,
      src: scene.asset.getImageById('Tweet'),
    }), () => {
      const time = score.time >= 60
        ? `${Math.floor(score.time / 60)}分${score.time % 60}秒`
        : `${score.time}秒`;
      const body = `私は${time}間でエナジードリンクを${score.count}本飲みました`;
      const hashtag = 'WakeMeUpGame';
      const url = 'https://game.gutchom.com/wake-me-up';
      location.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(body)}&url=${url}&hashtags=${hashtag}`;
    });
    tweetButton.x = 640;
    tweetButton.y = 700;
    scene.append(tweetButton);

    const retryButton = createButton(scene, new g.Sprite({
      scene,
      src: scene.asset.getImageById('Retry'),
    }), () => {g.game.replaceScene(createTitleScene())});
    retryButton.x = 120;
    retryButton.y = 700;
    scene.append(retryButton);
  });

  return scene;
}
