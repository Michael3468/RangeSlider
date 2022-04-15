import 'airbnb-browser-shims';

import Model from '../Model/Model';
import Presenter from '../Presenter/Presenter';
import View from '../View/View';

import {
  IMethod,
  IMethods,
  ISettings,
  IUserSettings,
} from './types';

import './RangeSlider.scss';

window.$ = require('jquery');
window.jQuery = require('jquery');

const defaultSettings: ISettings = {
  min: 0,
  max: 100,
  from: 30,
  to: 70,
  step: 1,
  range: true,
  scale: false,
  tooltips: true,
  vertical: false,
  confpanel: false,
  bar: true,
};

const RangeSliderInstances = new Map();

(function RangeSliderPlugin($) {
  let model: Model;
  let view: View;
  let presenter: Presenter;

  const methods: IMethods = {

    init: function init(userSettings: IUserSettings): JQuery<HTMLElement> {
      methods.destroy.call(this);

      const mergedSettings = $.extend({}, defaultSettings, userSettings);
      const rangeSlider = this as unknown as JQuery;
      const elementId = `#${rangeSlider[0]?.id}`;

      model = new Model(mergedSettings);
      view = new View(elementId, model.getSettings());
      presenter = new Presenter(model, view);

      RangeSliderInstances.set(elementId, { presenter });
      return rangeSlider;
    },

    destroy: function destroy(): JQuery<HTMLElement> {
      const rangeSlider = this as unknown as JQuery;
      const elementId = `#${rangeSlider[0]?.id}`;

      const slider = document.querySelector(elementId);

      if (slider) {
        slider.innerHTML = '';
        slider.classList.value = '';

        const confPanel = slider.nextSibling;
        confPanel?.remove();
      }

      RangeSliderInstances.delete(elementId);

      return rangeSlider;
    },

    update: function update(userSettings: IUserSettings): JQuery<HTMLElement> {
      const rangeSlider = this as unknown as JQuery;
      const elementId = `#${rangeSlider[0]?.id}`;
      const RSInstance = RangeSliderInstances.get(elementId);

      const currentSettings = RSInstance.presenter['model'].getSettings();
      const mergedSettings = $.extend({}, currentSettings, userSettings);

      return methods.init.call(this, mergedSettings);
    },
  };

  $.fn.RangeSlider = function RangeSlider(
    method: IMethod,
    userSettings?: IUserSettings,
  ): JQuery<HTMLElement> {
    const settings = <IUserSettings>userSettings;

    if (methods[method]) {
      return methods[method].call(this, settings);
    }
    $.error(`Method ${method} is not exist in jQuery.RangeSlider`);

    return this;
  };
}(jQuery));
