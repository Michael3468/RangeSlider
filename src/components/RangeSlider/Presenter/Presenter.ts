/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings } from '../RangeSlider/types';

import { Model } from '../Model/Model';
import View from '../View/View';

export default class Presenter {
  private model: Model;
  private view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.initRangeSlider();
  }

  private initRangeSlider(): void {
    this.view.createRangeSlider(this.model.getSettings());

    this.view.changeSettingsObserver.addObserver((settings: ISettings) => {
      this.model.updateSettings(settings);
    });
  }
}
