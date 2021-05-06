import { STAGE_HEIGHT } from './globals'

export default class Player extends g.E {
  left: g.Sprite;
  right: g.Sprite;

  constructor(scene: g.Scene, parent: g.E) {
    super({ scene, parent });
    const left = scene.asset.getImageById('player_left');
    const right = scene.asset.getImageById('player_right');

    this.width = Math.max(left.width, right.width);
    this.height = Math.max(left.height, right.height);
    this.x = g.game.width / 2 - this.width / 2;
    this.y = STAGE_HEIGHT - this.height;

    this.left = new g.Sprite({
      scene,
      parent: this,
      src: left,
      hidden: true,
    });
    this.right = new g.Sprite({
      scene,
      parent: this,
      src: right,
      hidden: false,
    });
  }

  move(x: number) {
    const next = x - this.width / 2;
    if (this.x < next) {
      this.children.forEach((e) => {e.hide()});
      this.right.show();
    }
    if (this.x > next) {
      this.children.forEach((e) => {e.hide()});
      this.left.show();
    }
    this.x = next;
    this.modified();
  }
}
