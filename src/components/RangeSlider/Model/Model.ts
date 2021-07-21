/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings } from '../RangeSlider/RangeSlider';
import { ISliderElements } from '../View/View';
import { ThumbName } from '../View/Thumb';

type TSliderElement = HTMLElement | null | undefined;

export class Model {
  settings: ISettings;

  minValue: number;
  maxValue: number;
  isTwoRunners: boolean;
  isScaleVisible: boolean;
  isVertical: boolean;
  valueFrom: number;
  valueTo: number;
  step: number | undefined;

  slider: TSliderElement;
  from: TSliderElement;
  to: TSliderElement;
  range: TSliderElement;

  rangeMarginTo: number | undefined;
  rangeMarginFrom: number | undefined;
  thumbMarginFrom: number | undefined;
  thumbMarginTo: number | undefined;
  rangePercent: number;

  thumbTooltipFrom: number | undefined;
  thumbTooltipTo: number | undefined;

  constructor(settings: ISettings) {
    this.validateSettings(settings);
    this.settings = settings;

    // default options
    this.minValue = settings.min;
    this.maxValue = settings.max;
    this.isTwoRunners = settings.isTwoRunners;
    this.isScaleVisible = settings.isScaleVisible;
    this.isVertical = settings.isVertical;

    this.valueFrom = this.getThumbValue(settings, 'from');
    this.valueTo = this.getThumbValue(settings, 'to');

    this.step = this.getStepInPercents(settings.step);

    // sliderElements
    this.slider;
    this.from;
    this.to;
    this.range;

    // bindings
    this.beginSliding = this.beginSliding.bind(this);
    this.stopSliding = this.stopSliding.bind(this);
    this.moveClosestThumb = this.moveClosestThumb.bind(this);
    this.setMargins = this.setMargins.bind(this);
    this.getStepInPercents = this.getStepInPercents.bind(this);
    this.convertToPx = this.convertToPx.bind(this);

    // margins
    this.rangeMarginTo;
    this.rangeMarginFrom;
    this.thumbMarginFrom;
    this.thumbMarginTo;
    this.rangePercent = (settings.max - settings.min) / 100;

    // tooltips values
    this.thumbTooltipFrom;
    this.thumbTooltipTo;

    this.initRangeSliderMargins();
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
  }

  private getThumbValue(settings: ISettings, thumbName: ThumbName): number {
    return thumbName === 'from' ? settings.valueFrom : settings.valueTo;
  }

  private initRangeSliderMargins(): void {
    const marginFrom = (this.settings.valueFrom - this.settings.min) / this.rangePercent;
    const marginTo = (this.settings.valueTo - this.settings.min) / this.rangePercent;

    this.setMargins('from', marginFrom);
    this.setMargins('to', marginTo);
  }

  private getTooltipValue(thumbName: ThumbName): number {
    if (thumbName === 'from') {
      return this.thumbMarginFrom! * this.rangePercent + this.settings.min;
    }
    if (thumbName === 'to') {
      return this.thumbMarginTo! * this.rangePercent + this.settings.min;
    }
    return 0;
  }

  public getSettings(): ISettings {
    return {
      // settings
      min: this.minValue,
      max: this.maxValue,
      isTwoRunners: this.isTwoRunners,
      isScaleVisible: this.isScaleVisible,
      isVertical: this.isVertical,
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
    };
  }

  public updateSettings(sliderElements: ISliderElements): void {
    this.slider = sliderElements.slider.element;
    this.from = sliderElements.from.element;
    this.to = sliderElements.to.element;
    this.range = sliderElements.range.element;

    this.addListenersToThumbs();
  }

  private addListenersToThumbs(): void {
    if (typeof this.from !== 'undefined') {
      this.from!.addEventListener('pointerdown', this.beginSliding);
      this.from!.addEventListener('pointerup', this.stopSliding);
    }

    if (typeof this.to !== 'undefined') {
      this.to!.addEventListener('pointerdown', this.beginSliding);
      this.to!.addEventListener('pointerup', this.stopSliding);
    }

    this.slider?.addEventListener('pointerdown', this.moveClosestThumb);
  }

  private beginSliding(event: any): void {
    const { target, pointerId } = event;
    event.preventDefault();
    target.setPointerCapture(pointerId);

    target.onpointermove = (e: any) => {
      const currentPosInPercents = this.getMarginLeft(this.currentCursorPosition(e));

      if (target.className === 'range-slider__thumb_from') {
        this.setMargins('from', currentPosInPercents);
      }
      if (target.className === 'range-slider__thumb_to') {
        this.setMargins('to', currentPosInPercents);
      }
    };
  }

  private stopSliding(event: any): void {
    const { target, pointerId } = event;
    target.onpointermove = null;
    target.releasePointerCapture(pointerId);
  }

  private moveClosestThumb(e: any): void {
    const currentPosInPercents = this.getMarginLeft(this.currentCursorPosition(e));
    const { fromPos, toPos } = this.getThumbsPosition(this.settings);
    const toCurrentDiff = Math.abs(currentPosInPercents - parseFloat(toPos!.toString()));

    // if from, check which is closest to the cursor position
    if (fromPos !== undefined) {
      const fromCurrentDiff = Math.abs(currentPosInPercents - parseFloat(fromPos.toString()));

      // move closest thumb to currentPos
      if (fromCurrentDiff < toCurrentDiff) {
        this.setMargins('from', currentPosInPercents);
        // move to view
        this.from!.style.marginLeft = `${this.thumbMarginFrom}%`;
        this.range!.style.marginLeft = `${this.rangeMarginFrom}%`;
      } else {
        this.setMargins('to', currentPosInPercents);
        // move to view
        this.to!.style.marginLeft = `${this.thumbMarginTo}%`;
        this.range!.style.marginRight = `${this.rangeMarginTo}%`;
      }
    }
    // move closest thumb to currentPos (for one runner slider)
    if (fromPos === undefined) {
      this.setMargins('to', currentPosInPercents);
      // move to view
      this.to!.style.marginLeft = `${this.thumbMarginTo}%`;
      this.range!.style.marginRight = `${this.rangeMarginTo}%`;
    }
  }

  private setMargins(thumbName: ThumbName, currentPosInPercents: number): void {
    const currentPosWithStep = this.getCurrentPosWithStep(currentPosInPercents);

    if (thumbName === 'from') {
      this.thumbMarginFrom = currentPosWithStep;
      this.rangeMarginFrom = currentPosWithStep;
      this.thumbTooltipFrom = this.getTooltipValue(thumbName);
    }
    if (thumbName === 'to') {
      this.thumbMarginTo = currentPosWithStep;
      this.rangeMarginTo = 100 - currentPosWithStep;
      this.thumbTooltipTo = this.getTooltipValue(thumbName);
    }
  }

  private getCurrentPosWithStep(currentPosInPercents: number) {
    const remains = currentPosInPercents % this.step!;

    let currentPos: number;
    if (remains >= (this.step! / 2)) {
      currentPos = currentPosInPercents - remains + this.step!;
    } else {
      currentPos = currentPosInPercents - remains;
    }
    if (currentPos > 100) return 100;
    if (currentPos < 0) return 0;
    return currentPos;
  }

  private getStepInPercents(step: number | undefined): number | undefined {
    if (step === undefined) return 0;

    const SLIDER_LENGTH_IN_PERCENTS = 100;
    const totalSteps = this.settings.max - this.settings.min;
    const stepInPercents = SLIDER_LENGTH_IN_PERCENTS / totalSteps;
    return stepInPercents * step;
  }

  private currentCursorPosition(event: any): number {
    let currentPos: number;
    let min: number;
    let max: number;

    if (this.settings.isVertical === false) {
      currentPos = event.clientX;
      min = this.slider?.getBoundingClientRect().left || 0;
      max = this.slider?.getBoundingClientRect().right || 0;
    } else {
      currentPos = event.clientY;
      min = this.slider?.getBoundingClientRect().top || 0;
      max = this.slider?.getBoundingClientRect().bottom || 0;
    }

    // set Edges to thumbs for twoRunners slider
    if (this.settings.isTwoRunners === true) {
      const targetClassName: string = event.target.className;

      if (targetClassName === 'range-slider__thumb_from') {
        max = this.convertToPx(this.thumbMarginTo! - this.step!)
          + min;
      }
      if (targetClassName === 'range-slider__thumb_to') {
        min += this.convertToPx(this.thumbMarginFrom! + this.step!);
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
    let percentsInPx: number;

    if (this.settings.isVertical === false) {
      percentsInPx = this.slider!.getBoundingClientRect().width / 100;
    } else {
      percentsInPx = this.slider!.getBoundingClientRect().height / 100;
    }
    return percents * percentsInPx;
  }

  private getThumbsPosition(settings: ISettings) {
    if (settings.isTwoRunners === true) {
      return {
        fromPos: this.thumbMarginFrom,
        toPos: this.thumbMarginTo,
      };
    }
    return {
      toPos: this.thumbMarginTo,
    };
  }

  private getMarginLeft(currentPos: number): number {
    let scalePercentInPx: number;
    let posOnScale: number;

    if (this.settings.isVertical === false) {
      scalePercentInPx = this.slider!.getBoundingClientRect().width / 100;
      posOnScale = currentPos - this.slider!.getBoundingClientRect().left;
    } else {
      scalePercentInPx = this.slider!.getBoundingClientRect().height / 100;
      posOnScale = currentPos - this.slider!.getBoundingClientRect().top;
    }
    const currentPosInPercents = posOnScale / scalePercentInPx;

    return currentPosInPercents;
  }
}
