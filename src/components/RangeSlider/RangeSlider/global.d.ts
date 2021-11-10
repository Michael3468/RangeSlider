/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import { IUserSettings } from './types';

export {};

declare global {
  interface JQuery {
    RangeSlider(settings: IUserSettings): JQuery;
  }
}
