import { IUserSettings, IMethod } from './types';

export {};

declare global {
  interface JQuery {
    init(settings: IUserSettings): JQuery;
    destroy(): JQuery;
    update(userSettings: IUserSettings): JQuery;
    RangeSlider(method: IMethod, userSettings: IUserSettings): JQuery;
  }

  // for window.$ = window.jQuery = require('jquery');
  interface Window {
    $: JQuery;
    jQuery: JQuery;
  }
}
