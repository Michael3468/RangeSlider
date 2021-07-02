import { ISettings } from '../RangeSlider/RangeSlider';

export type TSliderElement = HTMLElement | null | undefined;

export interface ISliderElements {
  slider: TSliderElement;
  from: TSliderElement;
  to: TSliderElement;
  range: TSliderElement;
}

export class View {
  slider!: HTMLElement | null;
  from: TSliderElement;
  to: TSliderElement;
  range: TSliderElement;
  percent: number;

  constructor(id: string | null) {
    this.slider = id ? document.querySelector(id) : null;
    this.from;
    this.to;
    this.range;
    this.percent = 0;
  }

  createRangeSlider(settings: ISettings): ISliderElements {
    this.slider!.className = 'range-slider';
    // create element range-slider__between
    const range: HTMLElement = document.createElement('div');
    range.className = 'range-slider__between';

    // set margin-right for range
    this.percent = settings.max / 100; // TODO add to Model
    range.style.marginRight =
      (settings.max - settings.thumb_to_value) / this.percent + '%';

    // if slider with two runners
    if (settings.isTwoRunners === true) {
      // set margin-left for twoRunners slider
      range.style.marginLeft = settings.thumb_from_value - settings.min + '%';
    }
    this.range = range;
    this.slider?.appendChild(range);

    // create thumbs
    if (settings.isTwoRunners === true) {
      // create element range-slider__thumb_from
      const thumbFrom: HTMLElement = document.createElement('div');
      thumbFrom.className = 'range-slider__thumb_from';
      thumbFrom.style.marginLeft =
        settings.thumb_from_value - settings.min + '%';
      this.from = thumbFrom;
      this.slider?.appendChild(thumbFrom);
    }

    // create element range-slider__thumb_to
    const thumbTo: HTMLElement = document.createElement('div');
    thumbTo.className = 'range-slider__thumb_to';
    thumbTo.style.marginLeft = settings.thumb_to_value / this.percent + '%';
    this.to = thumbTo;
    this.slider?.appendChild(thumbTo);

    let sliderElements: ISliderElements = {
      slider: this.slider,
      from: this.from,
      to: this.to,
      range: this.range,
    };
    return sliderElements;
  }
}
