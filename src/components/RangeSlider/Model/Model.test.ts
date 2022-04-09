/* eslint-disable dot-notation */

import { ISettings, ThumbName } from '../RangeSlider/types';
import Model from './Model';

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
    /* settings.min = settings.max - settings.step; */
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

  describe('settings.to < settings.min', () => {
    test('should to = min', () => {
      settings.to = 10;
      settings.min = 20;
      const result = Model['validateSettings'](settings);
      expect(result.to).toBe(settings.min);
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

describe('function getThumbValue:', () => {
  test('if thumbName == "from" should return settings.from', () => {
    const thumbName: ThumbName = 'from';
    const result = settings.from;
    expect(Model['getThumbValue'](settings, thumbName)).toBe(result);
  });

  test('if thumbName == "to" should return settings.to', () => {
    const thumbName: ThumbName = 'to';
    const result = settings.to;
    expect(Model['getThumbValue'](settings, thumbName)).toBe(result);
  });
});

describe('public getSettings', () => {
  test('check returned object', () => {
    const model = new Model(settings);
    expect(model.getSettings()).toStrictEqual(settings);
  });
});

describe('public updateSettings', () => {
  test('should return the passed values', () => {
    const model = new Model(settings);
    expect(model.updateSettings(settings)).toStrictEqual(settings);
  });

  test('should change the settings', () => {
    settings.min = 100;
    const model = new Model(settings);
    const currentSettings = model.getSettings();

    settings.min = 200;
    expect(model.updateSettings(settings)).not.toStrictEqual(currentSettings);
  });
});
