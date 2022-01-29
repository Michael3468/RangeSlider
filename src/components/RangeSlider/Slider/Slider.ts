import { AbstractSlider } from '../RangeSlider/types';

class Slider extends AbstractSlider {
  element: HTMLElement;

  constructor(id: string) {
    super();
    this.element = this.createSlider(id);
  }

  // eslint-disable-next-line class-methods-use-this
  protected createSlider(id: string): HTMLElement {
    const slider = <HTMLElement> document.querySelector(id);
    slider.className = 'range-slider';

    return slider;
  }
}

export default Slider;
