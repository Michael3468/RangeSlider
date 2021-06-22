import { Model } from './Model';
import { View } from './View';

export class Presenter {
  model: Model;
  view: View;

  constructor(Model:Model, View:View) {
    this.model = Model;
    this.view = View;
  }

  public initRangeSlider() {
    this.view.createRangeSlider(this.model.getOptions());
  }
}