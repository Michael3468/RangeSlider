import { ISettings } from '../RangeSlider/RangeSlider';
import { ISliderElements } from '../View/View';
import { TSliderElement } from '../View/View';

export class Model {
  minValue: number;
  maxValue: number;
  isTwoRunners: boolean;
  thumb_from_value: number;
  thumb_to_value: number;

  slider: TSliderElement;
  from: TSliderElement;
  to: TSliderElement;
  range: TSliderElement;

  constructor(settings: ISettings) {
    // default options
    this.minValue = settings.min;
    this.maxValue = this.getMaxValue(settings);
    this.isTwoRunners = settings.isTwoRunners;

    if (settings.isTwoRunners === true) {
      this.thumb_from_value = this.getThumbFromValue(settings);
    } else {
      this.thumb_from_value = this.minValue;
    }

    this.thumb_to_value = this.getThumbToValue(settings);

    // sliderElements
    this.slider;
    this.from;
    this.to;
    this.range;

    this.beginSliding = this.beginSliding.bind(this);
    this.stopSliding = this.stopSliding.bind(this);
  }

  private getThumbFromValue(settings: ISettings): number {
    if (this.minValue > settings.thumb_from_value) {
      return this.minValue;
    } else if (this.maxValue < settings.thumb_from_value) {
      return this.maxValue;
    } else {
      return settings.thumb_from_value;
    }
  }

  private getThumbToValue(settings: ISettings): number {
    if (this.maxValue < settings.thumb_to_value) {
      return this.maxValue;
    } else if (this.minValue > settings.thumb_to_value) {
      return this.minValue;
    } else {
      return settings.thumb_to_value;
    }
  }

  private getMaxValue(settings: ISettings): number {
    if (this.minValue > settings.max) {
      this.maxValue = this.minValue + 1;
      return this.maxValue;
    } else {
      return settings.max;
    }
  }

  public getSettings() {
    return {
      min: this.minValue,
      max: this.maxValue,
      isTwoRunners: this.isTwoRunners,
      thumb_from_value: this.thumb_from_value,
      thumb_to_value: this.thumb_to_value,
    };
  }

  public updateSettings(sliderElements: ISliderElements) {
    this.slider = sliderElements.slider;
    this.from = sliderElements.from;
    this.to = sliderElements.to;
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
  }

  // TODO event type?
  private beginSliding(event: any) {
    event.preventDefault();
    event.target.setPointerCapture(event?.pointerId);

    // console.log(this);
    let startX: number = event.clientX;
    let sliderEdgeLeft: number = this.slider!.getBoundingClientRect().left;
    let sliderEdgeRight: number = this.slider!.getBoundingClientRect().right;
    let sliderWidth: number = this.slider!.getBoundingClientRect().width;
    let ThumbHalfWidth: number = event.target.offsetWidth / 2;
    let newPosition: number;
    let fromX: number;
    let newPercentPosition: number;
    let betweenLeftPosition: number = parseFloat(this.range!.style.marginLeft);
    let betweenRightPosition: number = parseFloat(
      this.range!.style.marginRight
    );

    event.target.onpointermove = (event: any) => {
      fromX = event.clientX;

      if (fromX < sliderEdgeLeft) {
        fromX = sliderEdgeLeft;
      }
      if (fromX > sliderEdgeRight) {
        fromX = sliderEdgeRight;
      }

      newPosition = fromX - startX - ThumbHalfWidth;
      newPercentPosition = (newPosition + ThumbHalfWidth) / (sliderWidth / 100);

      if (event.target.className === 'range-slider__thumb_from') {
        event.target.style.marginLeft =
          betweenLeftPosition + newPercentPosition + '%';
        this.range!.style.marginLeft =
          betweenLeftPosition + newPercentPosition + '%';
        return;
      }
      if (event.target.className === 'range-slider__thumb_to') {
        event.target.style.marginLeft =
          100 - betweenRightPosition + newPercentPosition + '%';
        this.range!.style.marginRight =
          betweenRightPosition - newPercentPosition + '%';
        return;
      }
    };
  }

  private stopSliding(event: any): void {
    event.target.onpointermove = null;
    event.target.releasePointerCapture(event.pointerId);
  }
}
