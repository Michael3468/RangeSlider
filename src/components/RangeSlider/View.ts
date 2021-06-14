interface IOptions {
  twoRunners: boolean
};

export class View {
  slider: HTMLElement | null;

  options:IOptions = {
    twoRunners: true,
  };

  constructor(id: string) {
    this.slider = document.querySelector(id);
    // this.thumb_from = this.slider.querySelector('.range-slider__thumb_from');
    // this.thumb_to   = this.slider.querySelector('.range-slider__thumb_to');
  }

  public createRangeSlider(options?: IOptions) {
    console.log('RangeSlider created!'); // test
    console.log("options: " + options);

    // ЕСЛИ options.range === true (options.range получить из Model)
    if (options && options.twoRunners === true) {
      console.log('twoRunners === true'); // test
      // создаём двойной слайдер
      let RangeSlider = 
      `
      <div class = "range-slider" id = "range-slider">
        <div class="range-slider__between">
          <div class = "range-slider__thumb_from"></div>
          <div class = "range-slider__thumb_to"></div>
        </div>
      </div>
      `;
      this.slider?.append(RangeSlider);
    } else {
      // создаём одиночный слайдер
      
    }
  };
}