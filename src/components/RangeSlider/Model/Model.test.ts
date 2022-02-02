/* eslint-disable dot-notation */

import { ISettings, ThumbName } from '../RangeSlider/types';
import Model from './Model';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    isTwoRunners: true,
    isScaleVisible: true,
    isVertical: false,
    isTooltipsVisible: true,
    isConfPanel: true,
    isBarVisible: true,
    valueFrom: 1000,
    valueTo: 1490,
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

  describe('"settings.valueFrom < settings.min"', () => {
    test(' should return valueFrom = min', () => {
      settings.valueFrom = 0;
      settings.min = 10;
      const result = Model['validateSettings'](settings);
      expect(result.valueFrom).toBe(settings.min);
    });

    test('should return valueFrom != min', () => {
      settings.valueFrom = 20;
      settings.min = 10;
      const result = Model['validateSettings'](settings);
      expect(result.valueFrom).not.toBe(settings.min);
      expect(result.valueFrom).toBe(settings.valueFrom);
    });
  });

  describe('settings.valueTo < settings.min', () => {
    test('should valueTo = min', () => {
      settings.valueTo = 10;
      settings.min = 20;
      const result = Model['validateSettings'](settings);
      expect(result.valueTo).toBe(settings.min);
    });

    test('should valueTo != min', () => {
      settings.valueTo = 100;
      settings.min = 20;
      const result = Model['validateSettings'](settings);
      expect(result.valueTo).not.toBe(settings.min);
    });
  });

  test('settings.valueTo > settings.max should return valueTo = max', () => {
    settings.valueTo = 1200;
    settings.max = 1100;
    let validatedSettings = Model['validateSettings'](settings);
    expect(validatedSettings.valueTo).toBe(settings.max);

    settings.valueTo = 1200;
    settings.max = 1300;
    validatedSettings = Model['validateSettings'](settings);
    expect(validatedSettings.valueTo).toBe(settings.valueTo);
  });

  test('"settings.valueTo - settings.valueFrom < settings.step" should set valueFrom = valueTo - step', () => {
    settings.min = 200;
    settings.valueTo = 1400;
    settings.valueFrom = 1000;
    settings.step = 500;
    const value = settings.valueTo - settings.step;

    const result = Model['validateSettings'](settings);
    expect(result.valueFrom).toBe(value);
  });

  test('"settings.valueTo - settings.valueFrom < settings.step" should set valueTo = valueFrom + step', () => {
    settings.min = 1000;
    settings.valueTo = 1400;
    settings.valueFrom = 1000;
    settings.step = 500;
    const value = settings.valueFrom + settings.step;

    const result = Model['validateSettings'](settings);
    expect(result.valueTo).toBe(value);
  });
});

describe('function getThumbValue:', () => {
  test('if thumbName == "from" should return settings.valueFrom', () => {
    const thumbName: ThumbName = 'from';
    const result = settings.valueFrom;
    expect(Model['getThumbValue'](settings, thumbName)).toBe(result);
  });

  test('if thumbName == "to" should return settings.valueTo', () => {
    const thumbName: ThumbName = 'to';
    const result = settings.valueTo;
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
