import { ISettings } from '../RangeSlider/RangeSlider';

type TSliderElement = HTMLElement | null | undefined;

export class View {
  slider!: HTMLElement | null;
  from: TSliderElement;
  to: TSliderElement;
  rsBetween: TSliderElement;
  percent: number;

  constructor(id: string | null) {
    this.slider = id ? document.querySelector(id) : null;
    this.from;
    this.to;
    this.rsBetween;
    this.percent = 0;
    this.beginSliding = this.beginSliding.bind(this);
    this.stopSliding = this.stopSliding.bind(this);
  }

  createRangeSlider(settings: ISettings) {
    this.slider!.className = 'range-slider';
    // create element range-slider__between
    const rsBetween: HTMLElement = document.createElement('div');
    rsBetween.className = 'range-slider__between';

    // set margin-right for rsBetween
    this.percent = settings.max / 100; // TODO add to Model
    rsBetween.style.marginRight =
      (settings.max - settings.thumb_to_value) / this.percent + '%';

    // if slider with two runners
    if (settings.isTwoRunners === true) {
      // set margin-left for twoRunners slider
      rsBetween.style.marginLeft =
        settings.thumb_from_value - settings.min + '%';
    }
    this.rsBetween = rsBetween;
    this.slider?.appendChild(rsBetween);

    // create thumbs
    if (settings.isTwoRunners === true) {
      // create element range-slider__thumb_from
      const thumbFrom: HTMLElement = document.createElement('div');
      thumbFrom.className = 'range-slider__thumb_from';
      thumbFrom.style.marginLeft = settings.thumb_from_value - settings.min + '%';
      this.from = thumbFrom;
      this.slider?.appendChild(thumbFrom);
    }

    // create element range-slider__thumb_to
    const thumbTo: HTMLElement = document.createElement('div');
    thumbTo.className = 'range-slider__thumb_to';
    thumbTo.style.marginLeft = settings.thumb_to_value / this.percent + '%';
    this.to = thumbTo;
    this.slider?.appendChild(thumbTo);

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
  private beginSliding(event: any): void {
    event.preventDefault();
    event.target.setPointerCapture(event?.pointerId);

    let startX = event.clientX;
    let sliderEdgeLeft: number = this.slider!.getBoundingClientRect().left;
    let sliderEdgeRight: number = this.slider!.getBoundingClientRect().right;
    let sliderWidth: number = this.slider!.getBoundingClientRect().width;
    let ThumbHalfWidth: number = event.target.offsetWidth / 2;
    let newPosition: number;
    let fromX: number;
    let newPercentPosition: number;
    let betweenLeftPosition: number = parseFloat(this.rsBetween!.style.marginLeft);
    let betweenRightPosition: number = parseFloat(this.rsBetween!.style.marginRight);

    event.target.onpointermove = (event: any) => {
      fromX = event.clientX;

      if (fromX < sliderEdgeLeft) {
        fromX = sliderEdgeLeft;
      }
      if (fromX > sliderEdgeRight) {
        fromX = sliderEdgeRight;
      }

      newPosition = fromX - startX - ThumbHalfWidth;
      newPercentPosition = (newPosition + ThumbHalfWidth) / (sliderWidth / 100)

      if (event.target.className === 'range-slider__thumb_from') {
        event.target.style.marginLeft = betweenLeftPosition + newPercentPosition + '%';
        this.rsBetween!.style.marginLeft = betweenLeftPosition + newPercentPosition + '%';
        return;
      }
      if (event.target.className === 'range-slider__thumb_to') {
        event.target.style.marginLeft = 100 - betweenRightPosition + newPercentPosition + '%';
        this.rsBetween!.style.marginRight = betweenRightPosition - newPercentPosition + '%';
        return;
      }
    };
  }

  private stopSliding(event: any): void {
    event.target.onpointermove = null;
    event.target.releasePointerCapture(event.pointerId);
  }

}
