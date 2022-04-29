import { ISettings } from '../RangeSlider/types';

class Model {
  private settings: ISettings;

  constructor(settings: ISettings) {
    this.settings = Model.validateSettings(settings);
  }

  public getSettings(): ISettings {
    return {
      min: this.settings.min,
      max: this.settings.max,
      from: this.settings.from,
      to: this.settings.to,
      step: this.settings.step,
      range: this.settings.range,
      scale: this.settings.scale,
      vertical: this.settings.vertical,
      tooltips: this.settings.tooltips,
      confpanel: this.settings.confpanel,
      bar: this.settings.bar,
    };
  }

  public updateSettings(settings: ISettings): ISettings {
    return Model.validateSettings(settings);
  }

  private static validateSettings(settings: ISettings): ISettings {
    if (settings.step <= 0) {
      settings.step = 1;
    }

    if (settings.min >= settings.max) {
      settings.min = settings.max - settings.step;
    }

    if ((settings.max - settings.min) < settings.step) {
      settings.step = settings.max - settings.min;
    }

    if (settings.from < settings.min) {
      settings.from = settings.min;
    }

    if (settings.from > settings.max) {
      settings.from = settings.max;
    }

    if (settings.to < settings.from) {
      settings.to = settings.from;
    }

    if (settings.to > settings.max) {
      settings.to = settings.max;
    }

    if ((settings.to - settings.from) < settings.step) {
      if (settings.from >= (settings.min + settings.step)) {
        settings.from = settings.to - settings.step;
      } else {
        settings.to = settings.from + settings.step;
      }
    }

    return settings;
  }
}

export default Model;
