import { ISettings } from '../RangeSlider/RangeSlider';

export class Model {
  minValue: number;
  maxValue: number;
  isTwoRunners: boolean;
  thumb_from_value: number;
  thumb_to_value: number;

  constructor(settings: ISettings) {
    // default options
    this.minValue = settings.min;
    this.maxValue = this.getMaxValue(settings);
    this.isTwoRunners = settings.isTwoRunners;

    if (settings.isTwoRunners === true) {
      this.thumb_from_value = this.getThumbFromValue(settings);
    } else {
      this.thumb_from_value = this.minValue;
    }

    this.thumb_to_value = this.getThumbToValue(settings);
  }

  private getThumbFromValue(settings: ISettings): number {
    if (this.minValue > settings.thumb_from_value) {
      return this.minValue;
    } else if (this.maxValue < settings.thumb_from_value) {
      return this.maxValue;
    } else {
      return settings.thumb_from_value;
    }
  }

  private getThumbToValue(settings: ISettings): number {
    if (this.maxValue < settings.thumb_to_value) {
      return this.maxValue;
    } else if (this.minValue > settings.thumb_to_value) {
      return this.minValue;
    } else {
      return settings.thumb_to_value;
    }
  }

  private getMaxValue(settings: ISettings): number {
    if (this.minValue > settings.max) {
      this.maxValue = this.minValue + 1;
      return this.maxValue;
    } else {
      return settings.max;
    }
  }

  getOptions() {
    return {
      min: this.minValue,
      max: this.maxValue,
      isTwoRunners: this.isTwoRunners,
      thumb_from_value: this.thumb_from_value,
      thumb_to_value: this.thumb_to_value,
    };
  }
}
