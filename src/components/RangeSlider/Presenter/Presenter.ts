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
