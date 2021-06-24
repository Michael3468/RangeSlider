import { ISettings } from '../RangeSlider/RangeSlider';

export class View {
  slider!: HTMLElement | null;

  constructor(id: string | null) {
    this.slider = id ? document.querySelector(id) : null;
  }

  createRangeSlider(settings: ISettings) {

    this.slider!.className = 'range-slider'; // TODO wrap in slider__block || range-slider_block

    // create element range-slider__between
    const rsBetween: HTMLElement = document.createElement('div');
    rsBetween.className = 'range-slider__between';

    // set margin-right for slider
    const percent = settings.max / 100;
    rsBetween.style.marginRight = (settings.max - settings.thumb_to_value) / percent + '%';

    // if slider with two runners
    if (settings.isTwoRunners === true) {
      // set margin-left for twoRunners slider
      rsBetween.style.marginLeft = (settings.thumb_from_value - settings.min) + '%';

      // create element range-slider__thumb_from
      const rsThumbFrom: HTMLElement = document.createElement('div');
      rsThumbFrom.className = 'range-slider__thumb_from';
      rsBetween.appendChild(rsThumbFrom);
    }

    // create element range-slider__thumb_to
    const rsThumbTo: HTMLElement = document.createElement('div');
    rsThumbTo.className = 'range-slider__thumb_to';
    rsBetween.appendChild(rsThumbTo);

    // add elements to this.slider
    this.slider?.insertAdjacentElement('beforeend', rsBetween);
  }

  // function createScale() {}
  // add scale to slider 'afterend'
}
