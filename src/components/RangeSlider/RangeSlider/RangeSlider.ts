/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import './RangeSlider.scss';

import { Model } from '../Model/Model';
import View from '../View/View';
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
  isScaleVisible: boolean;
  isVertical: boolean;
  isTooltipsVisible: boolean;
  valueFrom: number;
  valueTo: number;
  step: number;
  rangePercent?: number;
}

(function ($) {
  const defaultSettings: ISettings = {
    min: 0,
    max: 100,
    isTwoRunners: true,
    isScaleVisible: false,
    isTooltipsVisible: true,
    isVertical: false,
    valueFrom: 30,
    valueTo: 70,
    step: 1,
  };

  // eslint-disable-next-line no-param-reassign
  $.fn.RangeSlider = function (userOptions): JQuery {
    const mergedSettings = $.extend({}, defaultSettings, userOptions);
    const elementId: string | null = this[0] ? `#${this[0].id}` : null;

    const model: Model = new Model(mergedSettings);
    const view: View = new View(elementId);
    // eslint-disable-next-line no-unused-vars
    const presenter: Presenter = new Presenter(model, view);

    return this;
  };
}(jQuery));
