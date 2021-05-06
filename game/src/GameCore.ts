import { AudioAsset } from '@akashic/akashic-engine'
import createButton from './createButton'
import createGameScene from './createGameScene'
import createFailureScene from './createFailureScene'
import { intersectArea, limit } from './utils'
import Gauge from './Gauge'
import Background from './Background'
import Monster from './Monster'
import Player from './Player'

const MESSAGE = [
  ['カフェイン中毒で倒れた！'],
  ['起床失敗！', '二度寝してしまった……'],
  ['出勤失敗！', '電車を乗り過ごした……'],
  ['眠すぎる……', '会社を早退した'],
];

export interface Score {
  time: number;
  count: number;
}

export default class GameCore {
  font: g.BitmapFont;
  scene: g.Scene;
  stage: number;

  se: AudioAsset;

  rootLayer: g.E;
  backgroundLayer: g.E;
  gameLayer: g.E;
  hudLayer: g.E;

  player: Player;
  background: Background;

  awakeGauge: Gauge;
  caffeineGauge: Gauge;

  score: Score;
  startAge = 0;
  count = 0;

  get isLastStage(): boolean {
    return this.stage === 4;
  }

  get result(): Score {
    this.score.count += this.count;
    this.score.time += (g.game.age - this.startAge) / g.game.fps;
    this.score.time = Math.round(this.score.time * 10) / 10;
    return this.score;
  }

  get awake(): number {
    return this.awakeGauge.rate;
  }

  set awake(quantity: number) {
    this.awakeGauge.changeColor(120, 100, 20 + 60 * quantity / 1000);
    this.awakeGauge.rate = limit(quantity, 0, 1000);
  }

  get caffeine(): number {
    return this.caffeineGauge.rate;
  }

  set caffeine(quantity: number) {
    const diff = this.awake - this.caffeine
    if (diff <= 300) {
      this.caffeineGauge.changeColor(60 * diff / 300, 100, 50);
    } else {
      this.caffeineGauge.changeColor(60, 100, 50);
    }
    this.caffeineGauge.rate = limit(quantity, 0, 1000);
  }

  constructor(scene: g.Scene, font: g.BitmapFont, stage: number, score: Score) {
    this.font = font;
    this.scene = scene;
    this.stage = stage;
    this.score = score;

    scene.append(this.rootLayer = new g.E({ scene }));
    this.backgroundLayer = new g.E({ scene, parent: this.rootLayer });
    this.gameLayer = new g.E({ scene, parent: this.rootLayer });
    this.hudLayer = new g.E({ scene, parent: this.rootLayer });

    this.background = new Background(scene, this.backgroundLayer, `bg0${stage}`);
    this.player = new Player(scene, this.gameLayer);
    this.awakeGauge = new Gauge(scene, this.hudLayer, this.font, 40, 'AWAKE');
    this.caffeineGauge = new Gauge(scene, this.hudLayer, this.font, 86, 'CAFFEINE');

    this.se = scene.asset.getAudioById("se");

    this.handleStart();
  }

  handleStart() {
    const title = new g.Label({
      scene: this.scene,
      parent: this.rootLayer,
      font: this.font,
      text: `STAGE ${this.stage}`,
      textColor: 'white',
      fontSize: 64,
      anchorX: 0.5,
      anchorY: 0.5,
      x: g.game.width / 2,
      y: 360,
    });

    this.scene.onUpdate.add(() => {
      if (this.awake >= (this.isLastStage ? 1000 : 500)) {
        title.destroy();
        this.startAge = g.game.age;
        this.scene.onUpdate.removeAll();
        this.scene.onUpdate.add(this.handleGame, this);
      }

      this.awake += 5
    }, this);
  }

  handleGame() {
    this.background.shiftParallax(this.player.x / g.game.width);
    if (g.game.age % (10 - this.stage * 2) === 0) {
      const monster = new Monster(this.scene, this.gameLayer);
      monster.onUpdate.add(() => {
        if (intersectArea(this.player, monster)) {
          this.count++;
          this.se.play();
          this.awake += 30;
          this.caffeine += 75;
          monster.destroy();
        }
      }, this);
    }
    if (!this.isLastStage && this.awake >= 1000) {
      this.handleProceed();
      return;
    }
    if (this.caffeine >= this.awake) {
      this.handleFailure(MESSAGE[0]);
      return;
    }
    if (this.awake <= 0) {
      this.handleFailure(MESSAGE[this.stage]);
      return;
    }
    if (!this.isLastStage) {
      this.awake -= 0.5;
    }
    this.caffeine -= 3;
  }

  handleFailure(messages: string[]) {
    g.game.replaceScene(createFailureScene(this.result, ...messages));
  }

  handleProceed() {
    const font = this.font;
    const scene = this.scene;
    const message = ['', '起床成功！', '出勤成功！', ''];
    scene.onUpdate.removeAll();
    scene.append(new g.FilledRect({
      scene,
      cssColor: 'white',
      opacity: 0.75,
      width: g.game.width,
      height: g.game.height,
    }));
    scene.append(new g.Label({
      scene,
      font,
      text: message[this.stage],
      textColor: 'black',
      fontSize: 64,
      x: 400,
      y: 240,
    }));
    scene.append(new g.Label({
      scene,
      font,
      text: `プレイ時間: ${this.result.time}秒`,
      textColor: 'black',
      fontSize: 48,
      x: 320,
      y: 420,
    }));
    scene.append(new g.Label({
      scene,
      font,
      text: `飲んだ本数: ${this.result.count}本`,
      textColor: 'black',
      fontSize: 48,
      x: 320,
      y: 468,
    }));
    const nextButton = createButton(scene, new g.Sprite({
      scene,
      src: scene.asset.getImageById('Next'),
    }), () => {g.game.replaceScene(createGameScene(this.stage + 1, this.result))});
    nextButton.moveTo(360, 640);
    scene.append(nextButton);
  }
}
