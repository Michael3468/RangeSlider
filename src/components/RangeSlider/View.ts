interface IOptions {
  twoRunners: boolean;
}

export class View {
  slider!: HTMLElement | null;

  options: IOptions = {
    twoRunners: true,
  };

  constructor(id: string | null) {
    id ? (this.slider = document.querySelector(id)) : null;
  }

  public createRangeSlider(options?: IOptions) {

    this.slider!.className = 'range-slider';

    if (options && options.twoRunners === true) {
      // двойной слайдер
      let twoRunnersSlider: string = `
      <div class="range-slider__between">
        <div class ="range-slider__thumb_from"></div>
        <div class ="range-slider__thumb_to"></div>
      </div>
      `;
      this.slider?.insertAdjacentHTML('beforeend', twoRunnersSlider);
      // добавить стили для range-slider__between (длина)
      // добавить местоположение thumb_from
      // добавить местоположение thumb_to
    } else {
      // одиночный слайдер
      let oneRunnerSlider: string = `
      <div class="range-slider__between">
        <div class ="range-slider__thumb_to"></div>
      </div>
      `;
      this.slider?.insertAdjacentHTML('beforeend', oneRunnerSlider);
      // добавить стили для range-slider__between (длина)
      // добавить местоположение thumb_from
      // добавить местоположение thumb_to
    }
  }
}
