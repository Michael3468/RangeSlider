/* eslint-disable no-param-reassign */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings, ThumbName } from '../RangeSlider/types';

export default class Model {
  settings: ISettings;

  min: number;
  max: number;
  isTwoRunners: boolean;
  isScaleVisible: boolean;
  isVertical: boolean;
  isTooltipsVisible: boolean;
  isConfPanel: boolean;
  isBarVisible: boolean;
  valueFrom: number;
  valueTo: number;
  step: number;

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

  private static validateSettings(settings: ISettings): ISettings {
    if (settings.min >= settings.max) {
      throw new Error("'max' must be greater than 'min'");
    }
    if (settings.valueFrom < settings.min) {
      throw new Error("'valueFrom' must be greater than 'min'");
    }
    if (settings.valueFrom > settings.valueTo) {
      throw new Error("'valueFrom' must be less than 'valueTo'");
    }
    if (settings.valueTo > settings.max) {
      throw new Error("'valueTo' must be less than 'max'");
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

  public getSettings(): ISettings {
    return {
      // settings
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
}
