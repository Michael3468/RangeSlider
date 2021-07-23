/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-between-class-members */
import { ISettings } from '../RangeSlider/RangeSlider';

import Slider from './Slider';
import { Thumb } from './Thumb';
import Range from './Range';
import Scale from './Scale';

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
  scale: Scale;

  constructor(id: string | null) {
    this.slider = new Slider(id);
    this.from = new Thumb('from');
    this.to = new Thumb('to');
    this.range = new Range();
    this.scale = new Scale();
  }

  public createRangeSlider(settings: ISettings): ISliderElements {
    if (settings.isTwoRunners === true) {
      this.slider.element!.appendChild(this.from.element);
    }
    this.slider.element!.appendChild(this.to.element);
    this.slider.element!.appendChild(this.range.element);

    if (settings.isScaleVisible === true) {
      this.slider.element!.appendChild(this.scale.element);
      this.scale.createScaleMarks(settings);
    }

    if (settings.isVertical === true) {
      this.slider.element!.className += ' range-slider_vertical';
      this.from.tooltip.element!.className += ' range-slider__tooltip_vertical';
      this.to.tooltip.element!.className += ' range-slider__tooltip_vertical';
    }

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
    if (settings.isTwoRunners === true) {
      this.range.setMarginLeft(settings.rangeMarginFrom);
      this.from.setMarginLeft(settings.thumbMarginFrom);

      this.from.tooltip.setTooltipText(settings.thumbTooltipFrom!);
    }
    this.range.setMarginRight(settings.rangeMarginTo);
    this.to.setMarginLeft(settings.thumbMarginTo);

    this.to.tooltip.setTooltipText(settings.thumbTooltipTo!);
  }
}
