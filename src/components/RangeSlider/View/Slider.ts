export class Slider {
  element: HTMLElement | null;

  constructor(id: string | null) {
    this.element = this.createSlider(id) as HTMLElement;
  }

  createSlider(id: string | null) {
    let slider = id ? document.querySelector(id) : null;
    slider!.className = 'range-slider';

    return slider;
  }

}