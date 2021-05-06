export default function createButton(scene: g.Scene, label: g.E, callback: () => void): g.E {
  const parent = new g.E({ scene, touchable: true });
  const pressed = new g.Sprite({
    scene,
    parent,
    src: scene.asset.getImageById('button_pressed'),
    hidden: true,
  });
  const button = new g.Sprite({
    scene,
    parent,
    src: scene.asset.getImageById('button'),
    hidden: false,
  });

  parent.width = Math.max(button.width, pressed.width);
  parent.height = Math.max(button.height, pressed.height);

  label.anchor(0.5, 0.5);
  label.moveTo(parent.width / 2, parent.height /2);
  parent.append(label);

  parent.onPointDown.add((e) => {
    button.hide();
    pressed.show();
  });
  parent.onPointMove.add((e) => {
    if (e.point.x >= 0 && e.point.y >= 0 && e.point.x + e.startDelta.x <= parent.width && e.point.y + e.startDelta.y <= parent.height) {
      button.hide();
      pressed.show();
    } else {
      button.show();
      pressed.hide();
    }
  });
  parent.onPointUp.add((e) => {
    button.show();
    pressed.hide();
    if (e.point.x >= 0 && e.point.y >= 0 && e.point.x + e.startDelta.x <= parent.width && e.point.y + e.startDelta.y <= parent.height) {
      callback();
    }
  });

  return parent;
}
