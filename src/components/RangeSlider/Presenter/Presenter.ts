import { Model } from '../Model/Model';
import { View } from '../View/View';

import { ISliderElements } from '../View/View';

export class Presenter {
  model: Model;
  view: View;
  sliderElements: ISliderElements | undefined;

  constructor(Model: Model, View: View) {
    this.model = Model;
    this.view = View;

    this.initRangeSlider();
    this.sliderElements;
    this.updateRangeSliderValues();
  }

  public initRangeSlider(): void {
    this.sliderElements = this.view.createRangeSlider(this.model.getSettings());
    this.model.updateSettings(this.sliderElements);
  }

  private updateRangeSliderValues() {
    this.sliderElements?.from.element.addEventListener('pointermove', () => {
      this.view.updateRangeSliderValues(this.model.getSettings());
    });

    this.sliderElements?.to.element.addEventListener('pointermove', () => {
      this.view.updateRangeSliderValues(this.model.getSettings());
    });
  }
}
