/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings, ThumbName } from '../RangeSlider/types';

export class Model {
  settings: ISettings;

  minValue: number;
  maxValue: number;
  isTwoRunners: boolean;
  isScaleVisible: boolean;
  isVertical: boolean;
  isTooltipsVisible: boolean;
  valueFrom: number;
  valueTo: number;
  step: number;
  rangePercent: number;

  constructor(settings: ISettings) {
    Model.validateSettings(settings);
    this.settings = settings;

    // default options
    this.minValue = this.settings.min;
    this.maxValue = this.settings.max;
    this.isTwoRunners = this.settings.isTwoRunners;
    this.isScaleVisible = this.settings.isScaleVisible;
    this.isVertical = this.settings.isVertical;
    this.isTooltipsVisible = this.settings.isTooltipsVisible;

    this.valueFrom = this.getThumbValue(this.settings, 'from');
    this.valueTo = this.getThumbValue(this.settings, 'to');

    this.step = this.getStepInPercents(this.settings.step);
    this.rangePercent = (this.settings.max - this.settings.min) / 100;

    this.getStepInPercents = this.getStepInPercents.bind(this);
  }

  private static validateSettings(settings: ISettings): void {
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
    if (settings.max - settings.min < settings.step) {
      throw new Error(`'step' must be less than ${settings.max - settings.min}`);
    }
    if (settings.valueTo - settings.valueFrom < settings.step) {
      throw new Error('distanse between thumbs must be equal or greater than step');
    }
  }

  private getThumbValue(settings: ISettings, thumbName: ThumbName): number {
    return thumbName === 'from' ? settings.valueFrom : settings.valueTo;
  }

  public getSettings(): ISettings {
    return {
      // settings
      min: this.minValue,
      max: this.maxValue,
      isTwoRunners: this.isTwoRunners,
      isScaleVisible: this.isScaleVisible,
      isVertical: this.isVertical,
      isTooltipsVisible: this.isTooltipsVisible,
      valueFrom: this.valueFrom,
      valueTo: this.valueTo,
      step: this.step,
      rangePercent: this.rangePercent,
    };
  }

  private getStepInPercents(step: number): number {
    const SLIDER_LENGTH_IN_PERCENTS = 100;
    const totalScaleSteps = this.settings.max - this.settings.min;
    const scaleStepInPercents = SLIDER_LENGTH_IN_PERCENTS / totalScaleSteps;
    return scaleStepInPercents * step;
  }
}
