/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { AbstractSlider } from '../RangeSlider/types';

export default class Slider extends AbstractSlider {
  element: HTMLElement;

  constructor(id: string) {
    super();
    this.element = this.createSlider(id);
  }

  // eslint-disable-next-line class-methods-use-this
  protected createSlider(id: string): HTMLElement {
    const slider = document.querySelector(id) as HTMLElement;
    slider!.className = 'range-slider';

    return slider;
  }
}
