/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings } from '../RangeSlider/types';

export default class Observer {
  observers: Function[];

  constructor() {
    this.observers = [];
  }

  addObserver(fn: Function): void {
    this.observers.forEach((observer) => {
      if (String(observer) === String(fn)) {
        throw new Error('Observer is already in the list');
      }
    });
    this.observers.push(fn);
  }

  removeObserver(fn: Function): void {
    let isObserverRemoved: boolean = false;

    this.observers.forEach((observer, index) => {
      if (String(observer) === String(fn)) {
        this.observers.splice(index, 1);
        isObserverRemoved = true;
      }
    });

    if (!isObserverRemoved) {
      throw new Error('Could not find observer in the list of observers');
    }
  }

  notifyObservers(data?: ISettings): void {
    this.observers.forEach((observer) => {
      observer(data);
    });
  }
}
