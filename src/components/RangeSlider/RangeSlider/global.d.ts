/* eslint-disable no-unused-vars */
import { IUserSettings } from './types.d.ts';

export {};

declare global {
  interface JQuery {
    RangeSlider(settings: IUserSettings): JQuery;
  }
}
