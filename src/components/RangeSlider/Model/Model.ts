import { ISettings } from '../RangeSlider/types';

class Model {
  private settings: ISettings;

  constructor(settings: ISettings) {
    this.settings = Model.validateSettings(settings);

    this.isTooltipsCollision = this.isTooltipsCollision.bind(this);
  }

  public getSettings(): ISettings {
    return this.settings;
  }

  public updateSettings(settings: ISettings): ISettings {
    return Model.validateSettings(settings);
  }

  public isTooltipsCollision(settings: ISettings): boolean {
    let fromEdge: number;
    let toEdge: number;

    this.settings = { ...settings };

    if (this.settings.vertical) {
      fromEdge = <number> this.settings.rectFrom?.bottom;
      toEdge = <number> this.settings.rectTo?.top;
    } else {
      fromEdge = <number> this.settings.rectFrom?.right;
      toEdge = <number> this.settings.rectTo?.left;
    }
    return toEdge - fromEdge <= 5;
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
