/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings } from '../RangeSlider/RangeSlider';
import { ThumbName } from '../View/Thumb';

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

  rangeMarginTo: number | undefined;
  rangeMarginFrom: number | undefined;
  thumbMarginFrom: number | undefined;
  thumbMarginTo: number | undefined;
  rangePercent: number;

  thumbTooltipFrom: number | undefined;
  thumbTooltipTo: number | undefined;

  constructor(settings: ISettings) {
    this.settings = settings;
    this.validateSettings(settings);

    // default options
    this.minValue = settings.min;
    this.maxValue = settings.max;
    this.isTwoRunners = settings.isTwoRunners;
    this.isScaleVisible = settings.isScaleVisible;
    this.isVertical = settings.isVertical;
    this.isTooltipsVisible = settings.isTooltipsVisible;

    this.valueFrom = this.getThumbValue(settings, 'from');
    this.valueTo = this.getThumbValue(settings, 'to');

    this.step = this.getStepInPercents(settings.step);

    this.getStepInPercents = this.getStepInPercents.bind(this);

    // margins
    this.rangeMarginTo;
    this.rangeMarginFrom;
    this.thumbMarginFrom;
    this.thumbMarginTo;
    this.rangePercent = (settings.max - settings.min) / 100;

    // tooltips values
    this.thumbTooltipFrom;
    this.thumbTooltipTo;
  }

  private validateSettings(settings: ISettings) {
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
    if (settings.step && settings.max - settings.min < settings.step) {
      throw new Error(`'step' must be less than ${settings.max - settings.min}`);
    }
    // validate step between thumbs
    if (settings.step && settings.valueTo - settings.valueFrom < settings.step) {
      if (settings.valueFrom + settings.step > settings.max) {
        if (settings.valueTo - settings.step < settings.min) {
          this.settings.valueFrom = settings.min;
          this.settings.valueTo = this.settings.valueFrom + settings.step;
        } else {
          this.settings.valueFrom = settings.valueTo - settings.step;
        }
      } else {
        this.settings.valueTo = settings.valueFrom + settings.step;
      }
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

      // margins
      rangeMarginTo: this.rangeMarginTo,
      rangeMarginFrom: this.rangeMarginFrom,
      thumbMarginFrom: this.thumbMarginFrom,
      thumbMarginTo: this.thumbMarginTo,

      // tooltips
      thumbTooltipFrom: this.thumbTooltipFrom,
      thumbTooltipTo: this.thumbTooltipTo,

      rangePercent: this.rangePercent,
      step: this.step,
    };
  }

  private getStepInPercents(step: number): number {
    const SLIDER_LENGTH_IN_PERCENTS = 100;
    const totalSteps = this.settings.max - this.settings.min;
    const stepInPercents = SLIDER_LENGTH_IN_PERCENTS / totalSteps;
    return stepInPercents * step;
  }
}
