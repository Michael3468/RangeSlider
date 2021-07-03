import { ISettings } from '../RangeSlider/RangeSlider';
import { Range } from './Range';

export type TSliderElement = HTMLElement | null | undefined;

export interface ISliderElements {
  slider: TSliderElement;
  from: TSliderElement;
  to: TSliderElement;
  range: Range;
}

export class View {
  slider!: HTMLElement | null;
  from: TSliderElement;
  to: TSliderElement;
  range: Range;

  constructor(id: string | null) {
    this.slider = id ? document.querySelector(id) : null;
    this.slider!.className = 'range-slider';

    this.from;
    this.to;
    this.range = new Range();
  }

  createRangeSlider(settings: ISettings): ISliderElements {
    this.slider!.appendChild(this.range.element);

    // set margin-right for range
    let rangeLength = settings.max - settings.min; // TODO add to Model
    let rangePercent = rangeLength / 100; // TODO add to Model

    let rangeRightMargin = (settings.max - settings.thumb_to_value) / rangePercent; // TODO add to Model
    // console.log(rangeRightMargin)
    this.range.setMarginRight(rangeRightMargin);

    // if slider with two runners
    let rangeLeftMargin = (settings.thumb_from_value - settings.min) / rangePercent; // TODO add to Model
    let thumbFromMargin = rangeLeftMargin; // TODO add to Model
    let thumbToMargin = 100 - rangeRightMargin; // TODO add to Model


    if (settings.isTwoRunners === true) {
      this.range.setMarginLeft(rangeLeftMargin);
    }

    // create thumbs
    if (settings.isTwoRunners === true) {
      // create element range-slider__thumb_from
      const thumbFrom: HTMLElement = document.createElement('div');
      thumbFrom.className = 'range-slider__thumb_from';
      thumbFrom.style.marginLeft = thumbFromMargin + '%';
      this.from = thumbFrom;
      this.slider?.appendChild(thumbFrom);
    }

    // create element range-slider__thumb_to
    const thumbTo: HTMLElement = document.createElement('div');
    thumbTo.className = 'range-slider__thumb_to';
    thumbTo.style.marginLeft = thumbToMargin + '%';
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

  
  // private getSettings(): ISettings {
  //   return this.presenter.getSettings();
  // }
}
