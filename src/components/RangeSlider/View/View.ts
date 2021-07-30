/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-between-class-members */
import { ISettings } from '../RangeSlider/RangeSlider';

import Slider from './Slider';
import { Thumb, ThumbName } from './Thumb';
import Range from './Range';
import Scale from './Scale';

export default class View {
  slider: Slider;
  from: Thumb;
  to: Thumb;
  range: Range;
  scale: Scale;

  settings: ISettings | undefined;

  constructor(id: string | null) {
    this.slider = new Slider(id);
    this.from = new Thumb('from');
    this.to = new Thumb('to');
    this.range = new Range();
    this.scale = new Scale();

    this.settings = undefined;

    this.beginSliding = this.beginSliding.bind(this);
    this.stopSliding = this.stopSliding.bind(this);
    this.moveClosestThumb = this.moveClosestThumb.bind(this);
    this.setMargins = this.setMargins.bind(this);
    this.convertToPx = this.convertToPx.bind(this);
  }

  public createRangeSlider(settings: ISettings): void {
    this.settings = settings;

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
      this.scale.element.style.height = '40px';

      if (settings.isTooltipsVisible === true) {
        this.from.tooltip.element.className += ' range-slider__tooltip_vertical';
        this.to.tooltip.element.className += ' range-slider__tooltip_vertical';
      }
    }

    if (settings.isTooltipsVisible === false) {
      this.from.tooltip.element.className += ' range-slider__tooltip_hidden';
      this.to.tooltip.element.className += ' range-slider__tooltip_hidden';
    }

    // wrap element in div block
    if (this.slider.element) {
      const wrapper = document.createElement('div');
      wrapper.className = 'range-slider_block';
      if (settings.isVertical === true) {
        wrapper.style.height = '310px';
      }
      this.slider.element.parentElement!.replaceChild(wrapper, this.slider.element);
      wrapper.appendChild(this.slider.element);
    }

    this.initRangeSliderMargins();
    this.updateRangeSliderValues(this.settings);
    this.addListenersToThumbs();
  }

  public updateRangeSliderValues(settings: ISettings): void {
    if (settings.isTwoRunners === true) {
      this.range.setMarginLeft(settings.rangeMarginFrom);
      this.from.setMarginLeft(settings.thumbMarginFrom);
      this.from.tooltip.setTooltipText(settings.thumbTooltipFrom!);
    }
    this.range.setMarginRight(settings.rangeMarginTo);
    this.to.setMarginLeft(settings.thumbMarginTo);
    this.to.tooltip.setTooltipText(settings.thumbTooltipTo!);
  }

  private addListenersToThumbs(): void {
    if (this.settings!.isTwoRunners) {
      this.from.element.addEventListener('pointerdown', this.beginSliding);
      this.from.element.addEventListener('pointerup', this.stopSliding);
    }
    this.to.element.addEventListener('pointerdown', this.beginSliding);
    this.to.element.addEventListener('pointerup', this.stopSliding);

    this.slider.element!.addEventListener('pointerdown', this.moveClosestThumb);
  }

  private beginSliding(event: any): void {
    const { target, pointerId } = event;
    event.preventDefault();
    target.setPointerCapture(pointerId);

    target.onpointermove = (e: any) => {
      const currentPosInPercents = this.getMarginLeft(this.currentCursorPosition(e));

      if (!this.settings) return;

      if (target.className === 'range-slider__thumb_from') {
        this.setMargins('from', currentPosInPercents);
        this.updateRangeSliderValues(this.settings);
      }
      if (target.className === 'range-slider__thumb_to') {
        this.setMargins('to', currentPosInPercents);
        this.updateRangeSliderValues(this.settings);
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private stopSliding(event: any): void {
    const { target, pointerId } = event;
    target.onpointermove = null;
    target.releasePointerCapture(pointerId);
  }

  private moveClosestThumb(e: any): void {
    if (!this.settings) return;

    const currentPosInPercents = this.getMarginLeft(this.currentCursorPosition(e));
    const fromPos: number | undefined = this.settings.thumbMarginFrom;
    const toPos: number | undefined = this.settings.thumbMarginTo;
    const toAndCurrentDiff = this.getDifferenceBetween(currentPosInPercents, toPos);

    // if from, check which is closest to the cursor position
    if (fromPos !== undefined) {
      const fromAndCurrentDiff = this.getDifferenceBetween(currentPosInPercents, fromPos);

      // move closest thumb to currentPos
      if (fromAndCurrentDiff < toAndCurrentDiff) {
        this.setMargins('from', currentPosInPercents);
        this.updateRangeSliderValues(this.settings);
      } else {
        this.setMargins('to', currentPosInPercents);
        this.updateRangeSliderValues(this.settings);
      }
    } else {
      // move thumb 'to' to/ currentPos (for one runner slider)
      this.setMargins('to', currentPosInPercents);
      this.updateRangeSliderValues(this.settings);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getDifferenceBetween(
    currentPosInPercents: number | undefined,
    thumbMargin: number | undefined,
  ): number {
    if (currentPosInPercents === undefined || thumbMargin === undefined) return 0;
    return Math.abs(currentPosInPercents - parseFloat(thumbMargin!.toString()));
  }

  private getMarginLeft(currentPos: number): number {
    let scalePercentInPx: number;
    let posOnScale: number;

    if (this.settings && this.settings.isVertical === false) {
      scalePercentInPx = this.slider.element!.getBoundingClientRect().width / 100;
      posOnScale = currentPos - this.slider.element!.getBoundingClientRect().left;
    } else {
      scalePercentInPx = this.slider.element!.getBoundingClientRect().height / 100;
      posOnScale = currentPos - this.slider.element!.getBoundingClientRect().top;
    }
    const currentPosInPercents = posOnScale / scalePercentInPx;

    return currentPosInPercents;
  }

  private currentCursorPosition(event: any): number {
    let currentPos: number;
    let min: number;
    let max: number;

    if (this.settings && this.settings.isVertical === false) {
      currentPos = event.clientX;
      min = this.slider.element!.getBoundingClientRect().left || 0;
      max = this.slider.element!.getBoundingClientRect().right || 0;
    } else {
      currentPos = event.clientY;
      min = this.slider.element!.getBoundingClientRect().top || 0;
      max = this.slider.element!.getBoundingClientRect().bottom || 0;
    }

    // set Edges to thumbs for twoRunners slider
    if (this.settings && this.settings.isTwoRunners === true) {
      const targetClassName: string = event.target.className;

      if (targetClassName === 'range-slider__thumb_from') {
        max = this.convertToPx(this.settings.thumbMarginTo! - this.settings.step) + min;
      } else if (targetClassName === 'range-slider__thumb_to') {
        min += this.convertToPx(this.settings.thumbMarginFrom! + this.settings.step);
      }
    }
    // set Edges to thumbs for twoRunners slider end

    // validate currentPos
    if (currentPos < min) {
      currentPos = min;
    } else if (currentPos > max) {
      currentPos = max;
    }
    //  validate currentPos end
    return currentPos;
  }

  private convertToPx(percents: number): number {
    let percentInPx: number;

    if (this.settings && this.settings.isVertical === false) {
      percentInPx = this.slider.element!.getBoundingClientRect().width / 100;
    } else {
      percentInPx = this.slider.element!.getBoundingClientRect().height / 100;
    }
    return percents * percentInPx;
  }

  private setMargins(thumbName: ThumbName, currentPosInPercents: number): void {
    const currentPosWithStep = this.getCurrentPosWithStep(currentPosInPercents);

    if (!this.settings) return;

    if (thumbName === 'from' && this.settings.isTwoRunners) {
      this.settings.thumbMarginFrom = currentPosWithStep;
      this.settings.rangeMarginFrom = currentPosWithStep;
      this.settings.thumbTooltipFrom = this.getTooltipValue(thumbName);
    }
    if (thumbName === 'to') {
      this.settings.thumbMarginTo = currentPosWithStep;
      this.settings.rangeMarginTo = 100 - currentPosWithStep;
      this.settings.thumbTooltipTo = this.getTooltipValue(thumbName);
    }
  }

  private getCurrentPosWithStep(currentPosInPercents: number): number {
    if (!this.settings) return 0;

    const remains = currentPosInPercents % this.settings.step;

    let currentPos: number;
    if (remains >= this.settings.step / 2) {
      currentPos = currentPosInPercents - remains + this.settings.step;
    } else {
      currentPos = currentPosInPercents - remains;
    }
    if (currentPos > 100) return 100;
    if (currentPos < 0) return 0;
    return currentPos;
  }

  private getTooltipValue(thumbName: ThumbName): number {
    if (!this.settings) return 0;

    if (thumbName === 'from') {
      return this.settings.thumbMarginFrom! * this.settings.rangePercent! + this.settings.min;
    }
    if (thumbName === 'to') {
      return this.settings.thumbMarginTo! * this.settings.rangePercent! + this.settings.min;
    }
    return 0;
  }

  private initRangeSliderMargins(): void {
    if (!this.settings) return;

    const marginFrom = (this.settings.valueFrom - this.settings.min) / this.settings.rangePercent!;
    const marginTo = (this.settings.valueTo - this.settings.min) / this.settings.rangePercent!;

    this.setMargins('from', marginFrom);
    this.setMargins('to', marginTo);
  }
}
