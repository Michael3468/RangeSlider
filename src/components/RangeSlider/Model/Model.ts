/* eslint-disable no-param-reassign */

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
    Model.validateSettings(settings);
    this.settings = settings;

    // default options
    this.min = this.settings.min;
    this.max = this.settings.max;
    this.from = Model.getThumbValue(this.settings, 'from');
    this.to = Model.getThumbValue(this.settings, 'to');
    this.step = settings.step;

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
    Model.validateSettings(settings);

    this.settings = settings;

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
    if (settings.max - settings.min < settings.step) {
      settings.step = settings.max - settings.min;
    }

    if (settings.min >= settings.max) {
      settings.min = settings.max - settings.step;
    }

    if (settings.from < settings.min) {
      settings.from = settings.min;
    }

    if (settings.from > settings.max) {
      settings.from = settings.max;
    }

    if (settings.to < settings.min) {
      settings.to = settings.min;
    }

    if (settings.to > settings.max) {
      settings.to = settings.max;
    }

    if (settings.to - settings.from < settings.step) {
      if (settings.from >= settings.min + settings.step) {
        settings.from = settings.to - settings.step;
      } else {
        settings.to = settings.from + settings.step;
      }
    }

    return settings;
  }

  private static getThumbValue(settings: ISettings, thumbName: ThumbName): number {
    return thumbName === 'from' ? settings.from : settings.to;
  }
}

export default Model;
