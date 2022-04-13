import { IMethod, IUserSettings } from './types';

export {};
declare global {
  interface JQuery {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    RangeSlider(method: IMethod, userSettings?: IUserSettings): JQuery<HTMLElement>;
  }

  // For use plugin from console
  // window.$ = require('jquery');
  // window.jQuery = require('jquery');
  interface Window {
    $: JQuery;
    jQuery: JQuery;
  }
}
