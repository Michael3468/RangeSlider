/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Observer from './Observer';

describe('addObserver', () => {
  it('should throw Error "Observer already in the list"', () => {
    const observer = new Observer();

    expect(() => {
      observer.addObserver(() => { console.log('test observer'); });
    }).not.toThrow();

    expect(() => {
      observer.addObserver(() => { console.log('test observer'); });
    }).toThrow();
  });
});
