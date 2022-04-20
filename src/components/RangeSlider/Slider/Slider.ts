import { AbstractSlider } from '../RangeSlider/types';

class Slider extends AbstractSlider {
  element: HTMLElement;

  constructor(id: string) {
    super();
    this.element = this.createSlider(id);
  }

  protected createSlider(id: string): HTMLElement {
    const slider = <HTMLElement> document.querySelector(id);

    try {
      if (!slider) {
        throw new Error('element don\'t exist on this page');
      }

      slider.className = 'range-slider';
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    return slider;
  }
}

export default Slider;
