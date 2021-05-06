import { STAGE_HEIGHT } from './globals'

export default class Monster extends g.Sprite {
  gravity = 1;
  stageHeight: number = STAGE_HEIGHT;

  constructor(scene: g.Scene, parent: g.E, gravity = 1) {
    super({
      scene,
      parent,
      src: scene.asset.getImageById('monster'),
      x: Math.floor(g.game.random.generate() * g.game.width),
      y: 0,
    });
    this.gravity = gravity;
    this.onUpdate.add(this.fall, this);
  }

  fall() {
    const dt = 1 / g.game.fps;
    this.y += dt*180 + this.y * dt*1.8 * this.gravity;
    if (this.y >= this.stageHeight) {
      this.destroy();
    }
    this.modified();
  }
}
