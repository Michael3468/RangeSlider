import Model from '../Model/Model';
import View from '../View/View';

import { IModelSettings, IViewSettings } from '../RangeSlider/types';

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
      const modelSettings = <IModelSettings>settings;

      modelSettings.currentPos = this.model.getMargin('from', modelSettings);
      this.view.viewSettings.thumbMarginFrom = this
        .model.getPosWithStepInPercents(modelSettings);
      this.view.settings.from = this.model.getThumbValue(modelSettings);

      modelSettings.currentPos = this.model.getMargin('to', modelSettings);
      this.view.viewSettings.thumbMarginTo = this
        .model.getPosWithStepInPercents(modelSettings);
      this.view.settings.to = this.model.getThumbValue(modelSettings);
    });

    this.view.changeSettingsObserver.addObserver((settings) => {
      this.updateModelAndPanel(<IModelSettings>settings);
    });

    if (this.isProdAndConfPanel()) {
      this.view.configurationPanel?.changeConfPanelSettingsObserver
        .addObserver((settings) => {
          this.updateModelAndView(<IModelSettings>settings);
        });

      this.view.configurationPanel?.changeConfPanelViewSettingsObserver
        .addObserver((settings) => {
          this.view.destroyView();
          this.view.viewSettings = <IViewSettings>settings;
          this.view.createRangeSlider(this.model.getSettings());
        });
    }

    this.view.changeCurrentPosObserver.addObserver((settings) => {
      const modelSettings = <IModelSettings>settings;

      this.model.updateSettings(modelSettings);
      this.view.settings.posWithStepInPercents = this
        .model.getPosWithStepInPercents(modelSettings);
      this.view.settings.curPosInPoints = this.model.getThumbValue(modelSettings);
    });

    if (process.env['NODE_ENV'] !== 'production') {
      this.view.configurationPanel?.getStepInPercentsObserver.addObserver((settings) => {
        const modelSettings = <IModelSettings>settings;
        modelSettings.stepInPrecents = this
          .model.getStepInPercents(modelSettings);
        this.view.settings = this.model.updateSettings(modelSettings);
      });
    }

    this.view.createRangeSlider(this.model.getSettings());

    return this;
  }

  private isProdAndConfPanel() {
    return process.env['NODE_ENV'] !== 'production' && this.view.configurationPanel;
  }

  private updateModelAndPanel(settings: IModelSettings) {
    this.model.updateSettings(settings);

    if (this.isProdAndConfPanel()) {
      this.view.configurationPanel?.updateState(settings, this.view.viewSettings);
    }
  }

  private updateModelAndView(settings: IModelSettings) {
    this.model.updateSettings(settings);
    this.view.destroyView();
    this.view.createRangeSlider(this.model.getSettings());
  }
}

export default Presenter;
