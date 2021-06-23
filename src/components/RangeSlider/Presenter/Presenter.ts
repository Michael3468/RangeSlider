import { Model } from '../Model/Model';
import { View } from '../View/View';

export class Presenter {
  model: Model;
  view: View;

  constructor(Model: Model, View: View) {
    this.model = Model;
    this.view = View;
  }

  public initRangeSlider() {
    console.log(this.model.getOptions()); // test
    this.view.createRangeSlider(this.model.getOptions());
  }
}
