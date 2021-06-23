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
    // set margin-left и margin-right (from settings)
    rsBetween.style.marginLeft = settings.thumb_from_value + '%';
    rsBetween.style.marginRight = 100 - settings.thumb_to_value + '%';

    // if slider with two runners
    if (settings.isTwoRunners === true) {
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

    // create scale
    // add scale to slider 'afterend'
  }
}
