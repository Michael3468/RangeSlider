import { ISettings } from '../RangeSlider/RangeSlider';

type TSliderElement = HTMLElement | null | undefined;

export class View {
  slider!: HTMLElement | null;
  from: TSliderElement;
  to: TSliderElement;

  constructor(id: string | null) {
    this.slider = id ? document.querySelector(id) : null;
    this.from;
    this.to;
    this.beginSliding = this.beginSliding.bind(this);
  }

  createRangeSlider(settings: ISettings) {
    this.slider!.className = 'range-slider'; // TODO wrap in slider__block || range-slider_block

    // create element range-slider__between
    const rsBetween: HTMLElement = document.createElement('div');
    rsBetween.className = 'range-slider__between';

    // set margin-right for slider
    const percent = settings.max / 100;
    rsBetween.style.marginRight =
      (settings.max - settings.thumb_to_value) / percent + '%';

    // if slider with two runners
    if (settings.isTwoRunners === true) {
      // set margin-left for twoRunners slider
      rsBetween.style.marginLeft =
        settings.thumb_from_value - settings.min + '%';

      // create element range-slider__thumb_from
      const rsThumbFrom: HTMLElement = document.createElement('div');
      rsThumbFrom.className = 'range-slider__thumb_from';
      rsBetween.appendChild(rsThumbFrom);
      this.from = rsThumbFrom;
    }

    // create element range-slider__thumb_to
    const rsThumbTo: HTMLElement = document.createElement('div');
    rsThumbTo.className = 'range-slider__thumb_to';
    rsBetween.appendChild(rsThumbTo);
    this.to = rsThumbTo;

    // add elements to this.slider
    this.slider?.insertAdjacentElement('beforeend', rsBetween);

    this.addListenersToThumbs();
  }

  private addListenersToThumbs() {
    // add listeners
    if (typeof this.from !== 'undefined') {
      this.from!.addEventListener('pointerdown', this.beginSliding);
      // add pointerup listener
      this.from!.addEventListener('pointerup', this.stopSliding);
    }
    
  }

  // TODO event type?
  private beginSliding(event: any): void {
    event.preventDefault();
    this.from!.setPointerCapture(event?.pointerId);

    let startX = event.clientX;
    let sliderEdgeLeft: number = this.slider!.getBoundingClientRect().left;

    this.from!.onpointermove = (event: any) => {
      let fromX: number = event.clientX;
      let sliderWidth: number = this.slider!.offsetWidth;
      let fromHalfWidth: number = this.from!.offsetWidth / 2;
      let sliderEdgeRight: number = sliderWidth + fromHalfWidth;

      if (fromX < sliderEdgeLeft) {
        fromX = sliderEdgeLeft;
      }
      if (fromX > sliderEdgeRight) {
        fromX = sliderEdgeRight;
      }

      this.from!.style.left = fromX - startX - fromHalfWidth + 'px';
    };
  }

  private stopSliding(): void {

  }

  // }
  // function createScale() {}
  // add scale to slider 'afterend'
}
