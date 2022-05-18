/**
 * @jest-environment jsdom
 */

import Model from './Model';

import { ISettings } from '../RangeSlider/types';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    range: true,
    scale: true,
    vertical: false,
    tooltips: true,
    confpanel: true,
    bar: true,
    from: 1000,
    to: 1490,
    step: 10,
  };
});

describe('private static validateSettings', () => {
  test('"settings.min >= settings.max" should return min = max - step', () => {
    settings.max = 100;
    settings.min = 110;
    settings.step = 20;

    const result = Model['validateSettings'](settings);
    expect(result.min).toBe(settings.max - settings.step);
  });

  describe('"settings.from < settings.min"', () => {
    test(' should return from = min', () => {
      settings.from = 0;
      settings.min = 10;
      const result = Model['validateSettings'](settings);
      expect(result.from).toBe(settings.min);
    });

    test('should return from != min', () => {
      settings.from = 20;
      settings.min = 10;
      const result = Model['validateSettings'](settings);
      expect(result.from).not.toBe(settings.min);
      expect(result.from).toBe(settings.from);
    });
  });

  describe('settings.to < settings.from', () => {
    test('should to = from + step', () => {
      settings.to = 10;
      settings.from = 20;
      settings.step = 1;
      const result = Model['validateSettings'](settings);
      expect(result.to).toBe(settings.from + settings.step);
    });

    test('should to != min', () => {
      settings.to = 100;
      settings.min = 20;
      const result = Model['validateSettings'](settings);
      expect(result.to).not.toBe(settings.min);
    });
  });

  test('settings.to > settings.max should return to = max', () => {
    settings.to = 1200;
    settings.max = 1100;
    let validatedSettings = Model['validateSettings'](settings);
    expect(validatedSettings.to).toBe(settings.max);

    settings.to = 1200;
    settings.max = 1300;
    validatedSettings = Model['validateSettings'](settings);
    expect(validatedSettings.to).toBe(settings.to);
  });

  test('"settings.to - settings.from < settings.step" should set from = to - step', () => {
    settings.min = 200;
    settings.to = 1400;
    settings.from = 1000;
    settings.step = 500;
    const value = settings.to - settings.step;

    const result = Model['validateSettings'](settings);
    expect(result.from).toBe(value);
  });

  test('"settings.to - settings.from < settings.step" should set to = from + step', () => {
    settings.min = 1000;
    settings.to = 1400;
    settings.from = 1000;
    settings.step = 500;
    const value = settings.from + settings.step;

    const result = Model['validateSettings'](settings);
    expect(result.to).toBe(value);
  });
});

describe('public getSettings', () => {
  test('check returned object', () => {
    const model = new Model(settings);
    expect(model.getSettings()).toStrictEqual(settings);
  });
});

describe('public updateSettings', () => {
  test('should return passed values', () => {
    const model = new Model(settings);
    expect(model.updateSettings(settings)).toStrictEqual(settings);
  });

  test('should change settings', () => {
    settings.min = 100;
    const model = new Model(settings);
    const currentSettings = model.getSettings();

    const settingsUpd = { ...settings };
    settingsUpd.min = 200;

    expect(model.updateSettings(settingsUpd)).not.toStrictEqual(currentSettings);
  });
});

describe('private isTooltipsCollision', () => {
  test('check settings.vertical - true', () => {
    settings.vertical = true;

    settings.rectFrom = {
      width: 20,
      height: 20,
      top: 100,
      left: 100,
      bottom: 120, /* value to check */
      right: 120,
      x: 100,
      y: 100,
      toJSON: () => {},
    };

    settings.rectTo = {
      width: 20,
      height: 20,
      top: 124, /* value to check */
      left: 120,
      bottom: 120,
      right: 140,
      x: 100,
      y: 100,
      toJSON: () => {},
    }

    const model = new Model(settings);
    let result = model.isTooltipsCollision(settings);
    expect(result).toBeTruthy();

    settings.rectTo = {
      width: 20,
      height: 20,
      top: 126, /* value to check */
      left: 120,
      bottom: 120,
      right: 140,
      x: 100,
      y: 100,
      toJSON: () => {},
    }

    const model2 = new Model(settings);
    let result2 = model2.isTooltipsCollision(settings);
    expect(result2).toBeFalsy();
  });

  test('check settings.vertical - false', () => {
    settings.vertical = false;

    settings.rectFrom = {
      width: 20,
      height: 20,
      top: 100,
      left: 100,
      bottom: 120,
      right: 120, /* value to check */
      x: 100,
      y: 100,
      toJSON: () => {},
    };

    settings.rectTo = {
      width: 20,
      height: 20,
      top: 124,
      left: 124, /* value to check */
      bottom: 120,
      right: 140,
      x: 100,
      y: 100,
      toJSON: () => {},
    }

    const model = new Model(settings);
    let result = model.isTooltipsCollision(settings);
    expect(result).toBeTruthy();

    settings.rectTo = {
      width: 20,
      height: 20,
      top: 124,
      left: 127, /* value to check */
      bottom: 120,
      right: 140,
      x: 100,
      y: 100,
      toJSON: () => {},
    }

    const model2 = new Model(settings);
    let result2 = model2.isTooltipsCollision(settings);
    expect(result2).toBeFalsy();
  });
});
