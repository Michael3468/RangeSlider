/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Model } from '../Model/Model';
import { View, ISliderElements } from '../View/View';

export default class Presenter {
  private model: Model;
  private view: View;
  private sliderElements: ISliderElements | undefined;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.sliderElements = undefined;
    this.initRangeSlider();

    this.updateRangeSlider = this.updateRangeSlider.bind(this);
    this.model.changeMarginsTooltipsObserver.addObserver(this.updateRangeSlider);
  }

  private initRangeSlider(): void {
    this.sliderElements = this.view.createRangeSlider(this.model.getSettings());
    this.model.updateSettings(this.sliderElements);
  }

  private updateRangeSlider(): void {
    this.view.updateRangeSliderValues(this.model.getSettings());
  }
}
