import { IUserSettings, IMethod } from './types';

export {};

declare global {
  interface JQuery {
    init(settings: IUserSettings): JQuery;
    destroy(): JQuery;
    RangeSlider(method: IMethod, userSettings: IUserSettings): JQuery;
  }

  interface Window {
    $: JQuery;
    jQuery: JQuery;
  }
}
