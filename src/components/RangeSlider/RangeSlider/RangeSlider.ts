import './RangeSlider.scss';

import { Model } from '../Model/Model';
import { View } from '../View/View';
import Presenter from '../Presenter/Presenter';

declare global {
  interface JQuery {
    RangeSlider(arg?: any): JQuery;
  }
}

export interface ISettings {
  min: number;
  max: number;
  isTwoRunners: boolean;
  fromValue: number;
  toValue: number;

  rangeRightMargin?: number;
  rangeLeftMargin?: number;
  thumbFromMargin?: number;
  thumbToMargin?: number;

  thumbFromTooltip?: number;
  thumbToTooltip?: number;
}

(function ($) {
  let defaultSettings: ISettings = {
    min: 0,
    max: 100,
    isTwoRunners: true,
    fromValue: 30,
    toValue: 70,
  };

  $.fn.RangeSlider = function (userOptions): any {
    let mergedSettings = $.extend({}, defaultSettings, userOptions);
    let elementId: string | null = this[0] ? `#${this[0].id}` : null;

    const model: Model = new Model(mergedSettings);
    const view: View = new View(elementId);
    const presenter: Presenter = new Presenter(model, view);

    return this;
  };
})(jQuery);
