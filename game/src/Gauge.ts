const LABEL_OFFSET = 240;

export default class Gauge extends g.E {
  private quantity = 0; // 0から1000で表す
  private readonly bar: g.FilledRect;

  constructor(scene: g.Scene, parent: g.E, font: g.BitmapFont, y: number, name: string) {
    super({ scene, parent });
    this.bar = new g.FilledRect({
      scene,
      parent: this,
      cssColor: 'white',
      width: this.maxWidth,
      height: 40,
      x: LABEL_OFFSET,
      y,
    });
    this.bar = new g.FilledRect({
      scene,
      parent: this,
      cssColor: 'rgba(0,0,0)',
      width: 0,
      height: 36,
      x: LABEL_OFFSET + 2,
      y: y + 2,
    });
    new g.Label({
      font,
      scene,
      parent: this,
      fontSize: 48,
      text: name,
      textColor: 'white',
      x: 20,
      y,
    });
  }

  changeColor(h: number, s: number, l: number, a = 100) {
    this.bar.cssColor = `hsla(${h}, ${s}%, ${l}%, ${a}%)`;
    this.bar.modified();
  }

  get maxWidth(): number {
    return g.game.width - (LABEL_OFFSET + 40);
  }

  get rate(): number {
    return this.quantity;
  }

  set rate(n: number) {
    this.quantity = Math.floor(n);
    this.bar.width = this.maxWidth * this.quantity / 1000;
    this.modified();
  }
}
