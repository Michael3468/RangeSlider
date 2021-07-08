export default class Slider {
  element: HTMLElement | null;

  constructor(id: string | null) {
    this.element = this.createSlider(id) as HTMLElement;
  }

  // eslint-disable-next-line class-methods-use-this
  createSlider(id: string | null) {
    const slider = id ? document.querySelector(id) : null;
    slider!.className = 'range-slider';

    return slider;
  }
}
