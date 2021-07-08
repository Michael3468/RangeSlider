export default class Observer {
  observers: any[];

  constructor() {
    this.observers = [];
  }

  addObserver(fn: object): void {
    if (typeof fn !== 'function') {
      throw new Error('observer must be a function');
    }
    for (let i = 0; i < this.observers.length; i += 1) {
      const observer = this.observers[i];
      if (observer === fn) {
        throw new Error('observer already in the list');
      }
    }
    this.observers.push(fn);
  }

  removeObserver(fn: object): void {
    for (let i = 0; i < this.observers.length; i += 1) {
      const observer = this.observers[i];
      if (observer === fn) {
        this.observers.splice(i, 1);
        return;
      }
    }
    throw new Error('could not find observer in list of observers');
  }

  notifyObservers(data?: any): void {
    const observersSnapshot: any[] = this.observers.slice(0);
    for (let i = 0; i < observersSnapshot.length; i += 1) {
      observersSnapshot[i](data);
    }
  }
}
