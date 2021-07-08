/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-between-class-members */
import { ISettings } from '../RangeSlider/RangeSlider';

import Slider from './Slider';
import { Thumb } from './Thumb';
import Range from './Range';

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

  constructor(id: string | null) {
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

    this.updateRangeSliderValues(settings);

    const sliderElements: ISliderElements = {
      slider: this.slider,
      from: this.from,
      to: this.to,
      range: this.range,
    };

    return sliderElements;
  }

  public updateRangeSliderValues(settings: ISettings) {
    this.range.setMarginRight(settings.rangeRightMargin);
    if (settings.isTwoRunners === true) {
      this.range.setMarginLeft(settings.rangeLeftMargin);
      this.from.setMarginLeft(settings.thumbFromMargin);
    }
    this.to.setMarginLeft(settings.thumbToMargin);

    this.from.tooltip.setTooltipText(Math.round(settings.thumbFromTooltip!));
    this.to.tooltip.setTooltipText(Math.round(settings.thumbToTooltip!));
  }
}
