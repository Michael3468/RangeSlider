/* eslint-disable no-param-reassign */

import { ISettings, ThumbName } from '../RangeSlider/types';

class Model {
  private settings: ISettings;

  private min: number;

  private max: number;

  private isTwoRunners: boolean;

  private isScaleVisible: boolean;

  private isVertical: boolean;

  private isTooltipsVisible: boolean;

  private isConfPanel: boolean;

  private isBarVisible: boolean;

  private valueFrom: number;

  private valueTo: number;

  private step: number;

  constructor(settings: ISettings) {
    Model.validateSettings(settings);
    this.settings = settings;

    // default options
    this.min = this.settings.min;
    this.max = this.settings.max;
    this.valueFrom = Model.getThumbValue(this.settings, 'from');
    this.valueTo = Model.getThumbValue(this.settings, 'to');
    this.step = settings.step;

    this.isTwoRunners = this.settings.isTwoRunners;
    this.isScaleVisible = this.settings.isScaleVisible;
    this.isVertical = this.settings.isVertical;
    this.isTooltipsVisible = this.settings.isTooltipsVisible;
    this.isConfPanel = this.settings.isConfPanel;
    this.isBarVisible = this.settings.isBarVisible;
  }

  public getSettings(): ISettings {
    return {
      min: this.min,
      max: this.max,
      valueFrom: this.valueFrom,
      valueTo: this.valueTo,
      step: this.step,
      isTwoRunners: this.isTwoRunners,
      isScaleVisible: this.isScaleVisible,
      isVertical: this.isVertical,
      isTooltipsVisible: this.isTooltipsVisible,
      isConfPanel: this.isConfPanel,
      isBarVisible: this.isBarVisible,
    };
  }

  public updateSettings(settings: ISettings): ISettings {
    Model.validateSettings(settings);

    this.settings = settings;

    this.min = this.settings.min;
    this.max = this.settings.max;
    this.valueFrom = this.settings.valueFrom;
    this.valueTo = this.settings.valueTo;
    this.step = this.settings.step;
    this.isTwoRunners = this.settings.isTwoRunners;
    this.isScaleVisible = this.settings.isScaleVisible;
    this.isVertical = this.settings.isVertical;
    this.isTooltipsVisible = this.settings.isTooltipsVisible;
    this.isConfPanel = this.settings.isConfPanel;
    this.isBarVisible = this.settings.isBarVisible;

    return this.settings;
  }

  private static validateSettings(settings: ISettings): ISettings {
    if (settings.max - settings.min < settings.step) {
      settings.step = settings.max - settings.min;
    }

    if (settings.min >= settings.max) {
      settings.min = settings.max - settings.step;
    }

    if (settings.valueFrom < settings.min) {
      settings.valueFrom = settings.min;
    }

    if (settings.valueFrom > settings.max) {
      settings.valueFrom = settings.max;
    }

    if (settings.valueTo < settings.min) {
      settings.valueTo = settings.min;
    }

    if (settings.valueTo > settings.max) {
      settings.valueTo = settings.max;
    }

    if (settings.valueTo - settings.valueFrom < settings.step) {
      if (settings.valueFrom >= settings.min + settings.step) {
        settings.valueFrom = settings.valueTo - settings.step;
      } else {
        settings.valueTo = settings.valueFrom + settings.step;
      }
    }

    return settings;
  }

  private static getThumbValue(settings: ISettings, thumbName: ThumbName): number {
    return thumbName === 'from' ? settings.valueFrom : settings.valueTo;
  }
}

export default Model;
