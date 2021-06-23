import { ISettings } from '../RangeSlider/RangeSlider';

export class Model {
  minValue: number;
  maxValue: number;
  isTwoRunners: boolean;
  thumb_from_value: number;
  thumb_to_value: number;

  constructor(settings?: ISettings) {
    // default options
    this.minValue = settings?.min || 0;
    this.maxValue = settings?.max || 100;
    this.isTwoRunners = settings?.isTwoRunners || true;
    this.thumb_from_value = settings?.thumb_from_value || 30,
    this.thumb_to_value = settings?.thumb_to_value || 70
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
