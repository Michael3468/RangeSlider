import { ISettings } from '../RangeSlider/RangeSlider';

import { Slider } from './Slider';
import { Thumb } from './Thumb';
import { Range } from './Range';

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

  public createRangeSlider(settings: ISettings): ISliderElements {
    if (settings.isTwoRunners === true) {
      this.slider.element!.appendChild(this.from.element);
    }
    this.slider.element!.appendChild(this.to.element);
    this.slider.element!.appendChild(this.range.element);

    this.updateRangeSlider(settings);

    let sliderElements: ISliderElements = {
      slider: this.slider,
      from: this.from,
      to: this.to,
      range: this.range,
    };

    return sliderElements;
  }

  public updateRangeSlider(settings: ISettings) {
    let rangeLength = settings.max - settings.min; // TODO add to Model
    let rangePercent = rangeLength / 100; // TODO add to Model

    let rangeRightMargin = (settings.max - settings.to_value) / rangePercent; // TODO add to Model
    let rangeLeftMargin = (settings.from_value - settings.min) / rangePercent; // TODO add to Model
    let thumbFromMargin = rangeLeftMargin; // TODO add to Model
    let thumbToMargin = 100 - rangeRightMargin; // TODO add to Model

    this.range.setMarginRight(rangeRightMargin);
    if (settings.isTwoRunners === true) {
      this.range.setMarginLeft(rangeLeftMargin);
      this.from.setMarginLeft(thumbFromMargin);
    }
    this.to.setMarginLeft(thumbToMargin);
  }
  // private getSettings(): ISettings {
  //   return this.presenter.getSettings();
  // }
}
