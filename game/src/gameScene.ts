import GameCore, { Score } from './GameCore'

export default function createGameScene(stage: number, score: Score = { time: 0, count: 0 }): g.Scene {
  const scene = new g.Scene({
    game: g.game,
    assetIds: [
      'font12',
      'font12_glyphs',
      'bg01',
      'bg02',
      'bg03',
      'bg04',
      'monster',
      'player_left',
      'player_right',
      'se',
    ],
  });

  scene.onLoad.add(() => {
    const font = new g.BitmapFont({
      src: scene.asset.getImageById('font12'),
      glyphInfo: JSON.parse(scene.asset.getTextById('font12_glyphs').data),
    });
    const game = new GameCore(scene, font, stage, score);

    scene.onPointDownCapture.add((e) => {
      game.player.move(e.point.x);
    });
    scene.onPointMoveCapture.add((e) => {
      game.player.move(e.point.x + e.startDelta.x);
    });
    scene.onPointUpCapture.add((e) => {
      game.player.move(e.point.x + e.startDelta.x);
    });
  });

  return scene;
}
