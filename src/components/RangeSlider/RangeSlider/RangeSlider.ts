/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings } from './types';
import './RangeSlider.scss';
import '../ConfigurationPanel/ConfigurationPanel';

import { Model } from '../Model/Model';
import View from '../View/View';
import Presenter from '../Presenter/Presenter';

(function ($) {
  const defaultSettings: ISettings = {
    min: 0,
    max: 100,
    valueFrom: 30,
    valueTo: 70,
    step: 1,
    isTwoRunners: true,
    isScaleVisible: false,
    isTooltipsVisible: true,
    isVertical: false,
    isConfPanel: false,
    isBarVisible: true,
  };

  // eslint-disable-next-line no-param-reassign
  $.fn.RangeSlider = function (userOptions): JQuery {
    const mergedSettings = $.extend({}, defaultSettings, userOptions);
    const elementId = `#${this[0]?.id}`;

    const model: Model = new Model(mergedSettings);
    const view: View = new View(elementId, mergedSettings);
    // eslint-disable-next-line no-unused-vars
    const presenter: Presenter = new Presenter(model, view);

    return this;
  };
}(jQuery));
