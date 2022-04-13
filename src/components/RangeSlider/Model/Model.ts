import { ISettings, ThumbName } from '../RangeSlider/types';

class Model {
  private settings: ISettings;

  private min: number;

  private max: number;

  private range: boolean;

  private scale: boolean;

  private vertical: boolean;

  private tooltips: boolean;

  private confpanel: boolean;

  private bar: boolean;

  private from: number;

  private to: number;

  private step: number;

  constructor(settings: ISettings) {
    this.settings = Model.validateSettings(settings);

    // default options
    this.min = this.settings.min;
    this.max = this.settings.max;
    this.from = Model.getThumbValue(this.settings, 'from');
    this.to = Model.getThumbValue(this.settings, 'to');
    this.step = this.settings.step;

    this.range = this.settings.range;
    this.scale = this.settings.scale;
    this.vertical = this.settings.vertical;
    this.tooltips = this.settings.tooltips;
    this.confpanel = this.settings.confpanel;
    this.bar = this.settings.bar;
  }

  public getSettings(): ISettings {
    return {
      min: this.min,
      max: this.max,
      from: this.from,
      to: this.to,
      step: this.step,
      range: this.range,
      scale: this.scale,
      vertical: this.vertical,
      tooltips: this.tooltips,
      confpanel: this.confpanel,
      bar: this.bar,
    };
  }

  public updateSettings(settings: ISettings): ISettings {
    this.settings = Model.validateSettings(settings);

    this.min = this.settings.min;
    this.max = this.settings.max;
    this.from = this.settings.from;
    this.to = this.settings.to;
    this.step = this.settings.step;
    this.range = this.settings.range;
    this.scale = this.settings.scale;
    this.vertical = this.settings.vertical;
    this.tooltips = this.settings.tooltips;
    this.confpanel = this.settings.confpanel;
    this.bar = this.settings.bar;

    return this.settings;
  }

  private static validateSettings(settings: ISettings): ISettings {
    const validatedSettings: ISettings = settings;
    if (settings.max - settings.min < settings.step) {
      validatedSettings.step = settings.max - settings.min;
    }

    if (settings.min >= settings.max) {
      validatedSettings.min = settings.max - settings.step;
    }

    if (settings.from < settings.min) {
      validatedSettings.from = settings.min;
    }

    if (settings.from > settings.max) {
      validatedSettings.from = settings.max;
    }

    if (settings.to < settings.min) {
      validatedSettings.to = settings.min;
    }

    if (settings.to > settings.max) {
      validatedSettings.to = settings.max;
    }

    if (settings.to - settings.from < settings.step) {
      if (settings.from >= settings.min + settings.step) {
        validatedSettings.from = settings.to - settings.step;
      } else {
        validatedSettings.to = settings.from + settings.step;
      }
    }

    return validatedSettings;
  }

  private static getThumbValue(settings: ISettings, thumbName: ThumbName): number {
    return thumbName === 'from' ? settings.from : settings.to;
  }
}

export default Model;
