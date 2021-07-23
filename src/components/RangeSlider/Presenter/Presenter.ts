/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Model } from '../Model/Model';
import { View, ISliderElements } from '../View/View';

export default class Presenter {
  model: Model;
  view: View;
  sliderElements: ISliderElements | undefined;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    // eslint-disable-next-line no-unused-expressions
    this.sliderElements;
    this.initRangeSlider();
    this.addListeners();
  }

  public initRangeSlider(): void {
    this.sliderElements = this.view.createRangeSlider(this.model.getSettings());
    this.model.updateSettings(this.sliderElements);
  }

  private addListeners() {
    if (!this.sliderElements?.slider.element) return;
    this.sliderElements.slider.element.addEventListener('changeMarginsEvent', () => {
      this.view.updateRangeSliderValues(this.model.getSettings());
    });
  }
}
