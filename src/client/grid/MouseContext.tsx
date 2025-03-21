import { Color } from '@logic-pad/core/data/primitives';
import { settingsStore } from '../contexts/SettingsContext';

class MouseContext {
  color: Color | null;
  replacing: boolean;
  inverted: boolean;

  constructor() {
    this.color = null;
    this.replacing = false;
    this.inverted = settingsStore.get('flipPrimaryMouseButton');
  }

  setColor(color: Color | null, replacing: boolean) {
    this.color = color;
    this.replacing = replacing;
  }

  setInverted(inverted: boolean) {
    this.inverted = inverted;
  }

  getColorForButtons(buttons: number) {
    if (this.inverted) {
      buttons = 3 - buttons;
    }
    switch (buttons) {
      case 1:
        return Color.Dark;
      case 2:
        return Color.Light;
      default:
        return undefined;
    }
  }
}

const mouseContext = new MouseContext();

export default mouseContext;
