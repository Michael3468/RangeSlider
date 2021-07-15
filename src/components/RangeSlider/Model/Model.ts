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
  fromValue: number;
  toValue: number;

  slider: TSliderElement;
  from: TSliderElement;
  to: TSliderElement;
  range: TSliderElement;

  rangeRightMargin: number | undefined;
  rangeLeftMargin: number | undefined;
  thumbFromMargin: number | undefined;
  thumbToMargin: number | undefined;
  rangePercent: number;

  thumbFromTooltip: number | undefined;
  thumbToTooltip: number | undefined;

  constructor(settings: ISettings) {
    this.settings = settings;

    // default options
    this.minValue = settings.min;
    this.maxValue = this.getMaxValue(settings);
    this.isTwoRunners = settings.isTwoRunners;
    this.isScaleVisible = settings.isScaleVisible;

    this.fromValue = this.getThumbValue(settings, 'from');
    this.toValue = this.getThumbValue(settings, 'to');

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

    // margins
    this.rangeRightMargin;
    this.rangeLeftMargin;
    this.thumbFromMargin;
    this.thumbToMargin;
    this.rangePercent = (settings.max - settings.min) / 100;

    // tooltips values
    this.thumbFromTooltip;
    this.thumbToTooltip;

    this.initRangeSliderMargins();
  }

  private getThumbValue(settings: ISettings, thumbName: ThumbName): number {
    const thumbValue = thumbName === 'from' ? settings.fromValue : settings.toValue;

    // validate default values
    if (this.minValue > thumbValue) {
      return this.minValue;
    }
    if (this.maxValue < thumbValue) {
      return this.maxValue;
    }

    if (settings.isTwoRunners === true || thumbName === 'to') {
      return thumbValue;
    }
    return this.minValue;
  }

  private getMaxValue(settings: ISettings): number {
    if (this.minValue > settings.max) {
      this.maxValue = this.minValue + 1; // TODO ???
      return this.maxValue;
    }
    return settings.max;
  }

  private initRangeSliderMargins(): void {
    this.rangeRightMargin = (this.settings.max - this.settings.toValue) / this.rangePercent;
    this.rangeLeftMargin = (this.settings.fromValue - this.settings.min) / this.rangePercent;
    this.thumbFromMargin = this.rangeLeftMargin;
    this.thumbToMargin = 100 - this.rangeRightMargin;

    this.thumbFromTooltip = this.getTooltipValue('from');
    this.thumbToTooltip = this.getTooltipValue('to');
  }

  private getTooltipValue(thumbName: ThumbName) {
    const tName = thumbName;
    if (tName === 'from') {
      return this.thumbFromMargin! * this.rangePercent + this.settings.min;
    }
    return this.thumbToMargin! * this.rangePercent + this.settings.min;
  }

  public getSettings(): ISettings {
    return {
      // settings
      min: this.minValue,
      max: this.maxValue,
      isTwoRunners: this.isTwoRunners,
      isScaleVisible: this.isScaleVisible,
      fromValue: this.fromValue,
      toValue: this.toValue,

      // margins
      rangeRightMargin: this.rangeRightMargin,
      rangeLeftMargin: this.rangeLeftMargin,
      thumbFromMargin: this.thumbFromMargin,
      thumbToMargin: this.thumbToMargin,

      // tooltips
      thumbFromTooltip: this.thumbFromTooltip,
      thumbToTooltip: this.thumbToTooltip,
    };
  }

  public updateSettings(sliderElements: ISliderElements) {
    this.slider = sliderElements.slider.element;
    this.from = sliderElements.from.element;
    this.to = sliderElements.to.element;
    this.range = sliderElements.range.element;

    this.addListenersToThumbs();
  }

  private addListenersToThumbs() {
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

  private beginSliding(event: any) {
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

  // eslint-disable-next-line class-methods-use-this
  private stopSliding(event: any): void {
    const { target, pointerId } = event;
    target.onpointermove = null;
    target.releasePointerCapture(pointerId);
  }

  private moveClosestThumb(e: any) {
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
        this.from!.style.marginLeft = `${this.thumbFromMargin}%`;
        this.range!.style.marginLeft = `${this.rangeLeftMargin}%`;
      } else {
        this.setMargins('to', currentPosInPercents);
        // move to view
        this.to!.style.marginLeft = `${this.thumbToMargin}%`;
        this.range!.style.marginRight = `${this.rangeRightMargin}%`;
      }
    }
    // move closest thumb to currentPos (for one runner slider)
    if (fromPos === undefined) {
      this.setMargins('to', currentPosInPercents);
      // move to view
      this.to!.style.marginLeft = `${this.thumbToMargin}%`;
      this.range!.style.marginRight = `${this.rangeRightMargin}%`;
    }
  }

  private setMargins(thumbName: ThumbName, currentPosInPercents: number) {
    if (thumbName === 'from') {
      this.thumbFromMargin = currentPosInPercents;
      this.rangeLeftMargin = currentPosInPercents;
      this.thumbFromTooltip = this.getTooltipValue(thumbName);
    }
    if (thumbName === 'to') {
      this.thumbToMargin = currentPosInPercents;
      this.rangeRightMargin = 100 - currentPosInPercents;
      this.thumbToTooltip = this.getTooltipValue(thumbName);
    }
  }

  private currentCursorPosition(event: any): number {
    let currentPos: number = event.clientX;

    const sliderEdgeLeft: number = this.slider?.getBoundingClientRect().left || 0;
    const sliderEdgeRight: number = this.slider?.getBoundingClientRect().right || 0;

    if (currentPos < sliderEdgeLeft) {
      currentPos = sliderEdgeLeft;
    } else if (currentPos > sliderEdgeRight) {
      currentPos = sliderEdgeRight;
    }
    return currentPos;
  }

  private getThumbsPosition(settings: ISettings) {
    if (settings.isTwoRunners === true) {
      return {
        fromPos: this.thumbFromMargin,
        toPos: this.thumbToMargin,
      };
    }
    return {
      toPos: this.thumbToMargin,
    };
  }

  private getMarginLeft(currentPos: number): number {
    const scalePercentInPx = this.slider!.getBoundingClientRect().width / 100;
    const posOnScale = currentPos - this.slider!.getBoundingClientRect().left;
    const currentPosInPercents = posOnScale / scalePercentInPx;

    return currentPosInPercents;
  }
}
