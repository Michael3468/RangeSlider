/* eslint-disable func-names */
/* eslint-disable no-undef */

import 'airbnb-browser-shims';

import View from '../View/View';
import Presenter from '../Presenter/Presenter';
import Model from '../Model/Model';

import { ISettings, IUserSettings, IMethod } from './types';

import './RangeSlider.scss';

window.$ = window.jQuery = require('jquery');

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

const RangeSliderInstances = new Map();

(function ($) {

  let model: Model;
  let view: View;
  let presenter: Presenter;

  const methods = {

    init: function(userSettings: IUserSettings): JQuery {
      methods['destroy'].call(this);

      const mergedSettings = $.extend({}, defaultSettings, userSettings);
      const rangeSlider = <JQuery>this;
      const elementId = `#${rangeSlider[0]?.id}`;

      model = new Model(mergedSettings);
      view = new View(elementId, model.getSettings());
      presenter = new Presenter(model, view);

      RangeSliderInstances.set(elementId, { presenter });

      return rangeSlider;
    },

    destroy: function(): JQuery {
      const rangeSlider = <JQuery>this;
      const slider = document.querySelector(`#${rangeSlider[0]?.id}`);

      if (slider) {
        slider.innerHTML = '';
        slider.classList.value = '';

        const confPanel = slider.nextSibling;
        confPanel?.remove();
      }

      return rangeSlider;
    },

    update: function(userSettings: IUserSettings): JQuery {
      const rangeSlider = <JQuery>this;
      const elementId = `#${rangeSlider[0]?.id}`;
      const RSInstance = RangeSliderInstances.get(elementId);

      const currentSettings = RSInstance.presenter['model'].getSettings();
      const mergedSettings = $.extend({}, currentSettings, userSettings);

      return methods['init'].call(this, mergedSettings);
    },
  };

  $.fn.RangeSlider = function (method: IMethod, userSettings?: IUserSettings): JQuery {

    const settings = <IUserSettings>userSettings;

    if (methods[method]) {
      return methods[method].call(this, settings);
    } else {
      $.error(`Method ${method} is not exist in jQuery.RangeSlider`);
    }
    return this;

  };
}(jQuery));
