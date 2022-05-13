import Model from '../Model/Model';
import View from '../View/View';

import { ISettings } from '../RangeSlider/types';

class Presenter {
  private model: Model;

  private view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.initRangeSlider();
  }

  private initRangeSlider(): Presenter {
    this.view.getMarginObserver.addObserver((settings) => {
      settings.currentPos = this.model.getMargin('from', settings);
      this.view.settings.thumbMarginFrom = this.model.getPosWithStepInPercents(settings);
      this.view.settings.from = this.model.getThumbValue(settings);

      settings.currentPos = this.model.getMargin('to', settings);
      this.view.settings.thumbMarginTo = this.model.getPosWithStepInPercents(settings);
      this.view.settings.to = this.model.getThumbValue(settings);
    });

    this.view.changeSettingsObserver.addObserver((settings) => {
      this.updateModelAndPanel(settings);
    });

    if (this.isProdAndConfPanel()) {
      this.view.configurationPanel?.changeConfPanelSettingsObserver
        .addObserver((settings) => {
          this.updateModelAndView(settings);
        });
    }

    this.view.tooltipsCollisionObserver.addObserver((settings) => {
      this.view.isTooltipsCollision = this.model.isTooltipsCollision(settings);
    });

    this.view.changeCurrentPosObserver.addObserver((settings) => {
      this.model.updateSettings(settings);
      this.view.settings.posWithStepInPercents = this.model.getPosWithStepInPercents(settings);
      this.view.settings.curPosInPoints = this.model.getThumbValue(settings);
    });

    this.view.createRangeSlider(this.model.getSettings());

    return this;
  }

  private isProdAndConfPanel() {
    return process.env['NODE_ENV'] !== 'production' && this.view.configurationPanel;
  }

  private updateModelAndPanel(settings: ISettings) {
    this.model.updateSettings(settings);

    if (this.isProdAndConfPanel()) {
      this.view.configurationPanel?.updateState(settings);
    }
  }

  private updateModelAndView(settings: ISettings) {
    this.model.updateSettings(settings);
    this.view.destroyView();
    this.view.createRangeSlider(this.model.getSettings());
  }
}

export default Presenter;
