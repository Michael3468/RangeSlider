export class Slider {
  element: HTMLElement | null;

  constructor(id: string) {
    this.element = this.createSlider(id) as HTMLElement;
  }

  createSlider(id: string) {
    let slider = document.querySelector(id);
    slider!.className = 'range-slider';

    return slider;
  }

}