import { ImageAsset } from '@akashic/akashic-engine'

export default class Background extends g.Sprite {
  constructor(scene: g.Scene, parent: g.E, assetId: string) {
    const asset = scene.asset.getImageById(assetId);
    super({
      scene,
      parent,
      src: asset,
      x: g.game.width / 2 - asset.width / 2,
      y: 0,
    });
  }

  /**
   * 背景の視差を変化させる。
   *
   * @param x 0から1で横方向の視差を指定する
   * @param y 0から1で縦方向の視差を指定する
   */
  shiftParallax(x = 0.5, y = 0) {
    this.x = (g.game.width - this.width) * x;
    this.y = (g.game.height - this.height) * y;
    this.modified();
  }
}
