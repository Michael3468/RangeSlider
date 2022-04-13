import { IMethod, IUserSettings } from './types';

export {};
declare global {
  interface JQuery {
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
