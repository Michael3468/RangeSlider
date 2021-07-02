import { Model } from '../Model/Model';
import { View } from '../View/View';

import { ISliderElements } from '../View/View';

export class Presenter {
  model: Model;
  view: View;

  constructor(Model: Model, View: View) {
    this.model = Model;
    this.view = View;
  }

  public initRangeSlider() {
    let sliderElements: ISliderElements;
    sliderElements = this.view.createRangeSlider(this.model.getSettings());

    this.model.updateSettings(sliderElements);
  }
}
