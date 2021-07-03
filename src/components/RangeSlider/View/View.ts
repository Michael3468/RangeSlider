import { ISettings } from '../RangeSlider/RangeSlider';

import { Slider } from './Slider';
import { Thumb } from './Thumb';
import { Range } from './Range';

export type TSliderElement = HTMLElement | null | undefined;

export interface ISliderElements {
  slider: Slider;
  from: Thumb;
  to: Thumb;
  range: Range;
}

export class View {
  slider: Slider;
  from: Thumb;
  to: Thumb;
  range: Range;

  constructor(id: string) {
    this.slider = new Slider(id);
    this.from = new Thumb('from');
    this.to = new Thumb('to');
    this.range = new Range();
  }

  createRangeSlider(settings: ISettings): ISliderElements {

    let rangeLength = settings.max - settings.min; // TODO add to Model
    let rangePercent = rangeLength / 100; // TODO add to Model

    let rangeRightMargin = (settings.max - settings.thumb_to_value) / rangePercent; // TODO add to Model
    let rangeLeftMargin = (settings.thumb_from_value - settings.min) / rangePercent; // TODO add to Model
    let thumbFromMargin = rangeLeftMargin; // TODO add to Model
    let thumbToMargin = 100 - rangeRightMargin; // TODO add to Model


    this.range.setMarginRight(rangeRightMargin); // TODO to updateRangeSlider

    if (settings.isTwoRunners === true) {
      this.range.setMarginLeft(rangeLeftMargin); // TODO to updateRangeSlider

      this.from.setMarginLeft(thumbFromMargin);  // TODO to updateRangeSlider
      this.slider.element!.appendChild(this.from.element);
    }
    this.slider.element!.appendChild(this.range.element);

    this.to.setMarginLeft(thumbToMargin);
    this.slider.element!.appendChild(this.to.element);


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
