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
      this.view.viewSettings.thumbMarginFrom = this.model.getPosWithStepInPercents(settings);
      this.view.settings.from = this.model.getThumbValue(settings);

      settings.currentPos = this.model.getMargin('to', settings);
      this.view.viewSettings.thumbMarginTo = this.model.getPosWithStepInPercents(settings);
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

      this.view.configurationPanel?.changeConfPanelViewSettingsObserver
        .addObserver((settings) => {
          this.view.destroyView();
          this.view.viewSettings = settings;
          this.view.createRangeSlider(this.model.getSettings());
        });
    }

    this.view.changeCurrentPosObserver.addObserver((settings) => {
      this.model.updateSettings(settings);
      this.view.settings.posWithStepInPercents = this.model.getPosWithStepInPercents(settings);
      this.view.settings.curPosInPoints = this.model.getThumbValue(settings);
    });

    if (process.env['NODE_ENV'] !== 'production') {
      this.view.configurationPanel?.getStepInPercentsObserver.addObserver((settings) => {
        settings.stepInPrecents = this.model.getStepInPercents(settings);
        this.view.settings = this.model.updateSettings(settings);
      });
    }

    this.view.createRangeSlider(this.model.getSettings());

    return this;
  }

  private isProdAndConfPanel() {
    return process.env['NODE_ENV'] !== 'production' && this.view.configurationPanel;
  }

  private updateModelAndPanel(settings: ISettings) {
    this.model.updateSettings(settings);

    if (this.isProdAndConfPanel()) {
      this.view.configurationPanel?.updateState(settings, this.view.viewSettings);
    }
  }

  private updateModelAndView(settings: ISettings) {
    this.model.updateSettings(settings);
    this.view.destroyView();
    this.view.createRangeSlider(this.model.getSettings());
  }
}

export default Presenter;
