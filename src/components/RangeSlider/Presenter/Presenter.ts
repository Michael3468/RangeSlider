/* eslint-disable dot-notation */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings } from '../RangeSlider/types';
import View from '../View/View';
import Model from '../Model/Model';

class Presenter {
  private model: Model;
  private view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.initRangeSlider();
  }

  private initRangeSlider(): Presenter {
    this.view.createRangeSlider(this.model.getSettings());

    this.view.changeSettingsObserver.addObserver((settings: ISettings) => {
      this.model.updateSettings(settings);
      if (process.env['NODE_ENV'] !== 'production') {
        if (this.view['configurationPanel']) {
          this.view['configurationPanel'].updateState(settings);
        }
      }
    });

    if (process.env['NODE_ENV'] !== 'production') {
      if (this.view['configurationPanel']) {
        this.view['configurationPanel'].changeConfPanelSettingsObserver
          .addObserver((settings: ISettings) => {
            this.model.updateSettings(settings);

            this.view['from'].element.parentNode?.removeChild(this.view['from'].element);
            this.view['to'].element.parentNode?.removeChild(this.view['to'].element);
            this.view['range'].element.parentNode?.removeChild(this.view['range'].element);
            while (this.view['scale'].element.firstChild) {
              this.view['scale'].element.removeChild(this.view['scale'].element.firstChild);
            }
            this.view['scale'].element.parentNode?.removeChild(this.view['scale'].element);

            this.view.createRangeSlider(this.model.getSettings());
          });
      }
    }

    return this;
  }
}

export default Presenter;
