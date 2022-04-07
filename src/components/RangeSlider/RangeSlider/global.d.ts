/* eslint-disable no-unused-vars */

import { IUserSettings } from './types';

export {};

declare global {
  interface JQuery {
    RangeSlider(settings: IUserSettings): JQuery;
  }

  interface Window {
    $: JQuery;
    jQuery: JQuery;
  }
}
