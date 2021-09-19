/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISliderElement } from '../RangeSlider/types';

export default class Slider implements ISliderElement {
  element: HTMLElement;

  constructor(id: string) {
    this.element = this.createSlider(id);
  }

  // eslint-disable-next-line class-methods-use-this
  private createSlider(id: string): HTMLElement {
    const slider = document.querySelector(id) as HTMLElement;
    slider!.className = 'range-slider';

    return slider;
  }
}
