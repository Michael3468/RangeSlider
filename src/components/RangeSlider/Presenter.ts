import { Model } from './Model';
import { View } from './View';

export class Presenter {
  model: Model;
  view: View;

  constructor(Model:Model, View:View) {
    this.model = Model;
    this.view = View;
  }

  init() {
    console.log(this.view);
    console.log(this.model.getOptions());
  }
}