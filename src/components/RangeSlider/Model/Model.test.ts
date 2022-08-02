/**
 * @jest-environment jsdom
 */

import Model from './Model';

import { IModelSettings } from '../RangeSlider/types';

abstract class ModelHint {
  abstract getOnePointInPerсents(settings: IModelSettings): number;
}

let modelSettings: IModelSettings;

beforeEach(() => {
  modelSettings = {
    min: 0,
    max: 1500,
    from: 1000,
    to: 1490,
    step: 10,

    stepInPercents: 1,
    currentPos: 1,
    curPosInPoints: 1,
    posWithStepInPercents: 1,
  };
});

describe('private static validateSettings', () => {
  describe('test modelSettings.step <= 0', () => {
    test('shold return 1 if step = 0', () => {
      modelSettings.step = 0;
      const result = Model['validateSettings'](modelSettings);
      expect(result.step).toBe(1);
    });

    test('shold return 1 if step < 0', () => {
      modelSettings.step = -0.8;
      const result = Model['validateSettings'](modelSettings);
      expect(result.step).toBe(1);
    });

    test('shold return 1 if step < 0', () => {
      modelSettings.step = -8;
      const result = Model['validateSettings'](modelSettings);
      expect(result.step).toBe(1);
    });
  });

  test('"modelSettings.min >= modelSettings.max" should return min = max - step', () => {
    modelSettings.max = 100;
    modelSettings.min = 110;
    modelSettings.step = 20;

    const result = Model['validateSettings'](modelSettings);
    expect(result.min).toBe(modelSettings.max - modelSettings.step);
  });

  test('if (max - min) < step should return step = max - min', () => {
    modelSettings.max = 100;
    modelSettings.min = 95;
    modelSettings.step = 10;

    const result = Model['validateSettings'](modelSettings);
    expect(result.step).toBe(result.max - result.min);
  });

  describe('"modelSettings.from < modelSettings.min"', () => {
    test(' should return from = min', () => {
      modelSettings.from = 0;
      modelSettings.min = 10;
      const result = Model['validateSettings'](modelSettings);
      expect(result.from).toBe(modelSettings.min);
    });

    test('should return from != min', () => {
      modelSettings.from = 20;
      modelSettings.min = 10;
      const result = Model['validateSettings'](modelSettings);
      expect(result.from).not.toBe(modelSettings.min);
      expect(result.from).toBe(modelSettings.from);
    });
  });

  describe('modelSettings.to < modelSettings.from', () => {
    test('should to = from + step', () => {
      modelSettings.to = 10;
      modelSettings.from = 20;
      modelSettings.step = 1;
      const result = Model['validateSettings'](modelSettings);
      expect(result.to).toBe(modelSettings.from + modelSettings.step);
    });

    test('should to != min', () => {
      modelSettings.to = 100;
      modelSettings.min = 20;
      const result = Model['validateSettings'](modelSettings);
      expect(result.to).not.toBe(modelSettings.min);
    });
  });

  test('modelSettings.to > modelSettings.max should return to = max', () => {
    modelSettings.to = 1200;
    modelSettings.max = 1100;
    let validatedSettings = Model['validateSettings'](modelSettings);
    expect(validatedSettings.to).toBe(modelSettings.max);

    modelSettings.to = 1200;
    modelSettings.max = 1300;
    validatedSettings = Model['validateSettings'](modelSettings);
    expect(validatedSettings.to).toBe(modelSettings.to);
  });

  test('"modelSettings.to - modelSettings.from < modelSettings.step" should set from = to - step', () => {
    modelSettings.min = 200;
    modelSettings.to = 1400;
    modelSettings.from = 1000;
    modelSettings.step = 500;
    const value = modelSettings.to - modelSettings.step;

    const result = Model['validateSettings'](modelSettings);
    expect(result.from).toBe(value);
  });

  test('"modelSettings.to - modelSettings.from < modelSettings.step" should set to = from + step', () => {
    modelSettings.min = 1000;
    modelSettings.to = 1400;
    modelSettings.from = 1000;
    modelSettings.step = 500;
    const value = modelSettings.from + modelSettings.step;

    const result = Model['validateSettings'](modelSettings);
    expect(result.to).toBe(value);
  });
});

describe('public getSettings', () => {
  test('check returned object', () => {
    const model = new Model(modelSettings);
    expect(model.getSettings()).toStrictEqual(modelSettings);
  });
});

describe('public updateSettings', () => {
  test('should return passed values', () => {
    const model = new Model(modelSettings);
    expect(model.updateSettings(modelSettings)).toStrictEqual(modelSettings);
  });

  test('should change modelSettings', () => {
    modelSettings.min = 100;
    const model = new Model(modelSettings);
    const currentSettings = model.getSettings();

    const settingsUpd = { ...modelSettings };
    settingsUpd.min = 200;

    expect(model.updateSettings(settingsUpd)).not.toStrictEqual(currentSettings);
  });
});

describe('public getPosWithStepInPercents', () => {
  const posInitValue = 1;

  beforeEach(() => {
    modelSettings = {
      min: 0,
      max: 100,
      from: 30,
      to: 70,
      step: 1,

      stepInPercents: 1,
      currentPos: 4,
      curPosInPoints: 1,
      posWithStepInPercents: posInitValue,
    };
  });

  test('should return 4 (posWithStep = curPos - remains)', () => {
    const model = new Model(modelSettings);
    jest.spyOn(model, 'getStepInPercents').mockReturnValueOnce(2);

    expect(model['settings'].posWithStepInPercents).toBe(posInitValue);

    const resValue = 4;
    const result = model.getPosWithStepInPercents(modelSettings);

    expect(result).toBe(resValue);
    expect(model['settings'].posWithStepInPercents).toBe(resValue);
  });

  test('should return 9 (posWithStep = curPos - remains + stepInPercents)', () => {
    modelSettings.stepInPercents = 3;
    modelSettings.currentPos = 8;

    const model = new Model(modelSettings);
    jest.spyOn(model, 'getStepInPercents').mockReturnValueOnce(3);

    expect(model['settings'].posWithStepInPercents).toBe(posInitValue);

    const resValue = 9;
    const result = model.getPosWithStepInPercents(modelSettings);

    expect(result).toBe(resValue);
    expect(model['settings'].posWithStepInPercents).toBe(resValue);
  });

  test('should return 0', () => {
    modelSettings.currentPos = 0;

    const model = new Model(modelSettings);
    expect(model['settings'].posWithStepInPercents).toBe(posInitValue);

    const resValue = 0;
    const result = model.getPosWithStepInPercents(modelSettings);

    expect(result).toBe(resValue);
    expect(model['settings'].posWithStepInPercents).toBe(resValue);
  });

  test('should return 100', () => {
    modelSettings.currentPos = 100;

    const model = new Model(modelSettings);
    expect(model['settings'].posWithStepInPercents).toBe(posInitValue);

    const resValue = 100;
    const result = model.getPosWithStepInPercents(modelSettings);

    expect(result).toBe(resValue);
    expect(model['settings'].posWithStepInPercents).toBe(resValue);
  });
});

describe('public getThumbValue', () => {
  beforeEach(() => {
    modelSettings = {
      min: 0,
      max: 100,
      from: 30,
      to: 70,
      step: 1,

      stepInPercents: 1,
      currentPos: 4,
      curPosInPoints: 1,
      posWithStepInPercents: 1,
    };
  });

  test('should return 1', () => {
    const model = new Model(modelSettings);
    jest.spyOn(model as unknown as ModelHint, 'getOnePointInPerсents').mockReturnValueOnce(1);

    const result = model.getThumbValue(modelSettings);
    expect(result).toBe(1);
  });

  test('should return 1', () => {
    modelSettings.step = 0.005;
    const model = new Model(modelSettings);
    jest.spyOn(model as unknown as ModelHint, 'getOnePointInPerсents').mockReturnValueOnce(1);

    const result = model.getThumbValue(modelSettings);
    expect(result).toBe(0.001);
  });
});

describe('public getMargin', () => {
  beforeEach(() => {
    modelSettings = {
      min: 0,
      max: 100,
      from: 30,
      to: 70,
      step: 1,

      stepInPercents: 1,
      currentPos: 4,
      curPosInPoints: 1,
      posWithStepInPercents: 1,
    };
  });

  test('should return 30', () => {
    const model = new Model(modelSettings);
    jest.spyOn(model as unknown as ModelHint, 'getOnePointInPerсents').mockReturnValueOnce(1);

    const result = model.getMargin('from', modelSettings);
    expect(result).toBe(30);
  });

  test('should return 60', () => {
    const model = new Model(modelSettings);
    jest.spyOn(model as unknown as ModelHint, 'getOnePointInPerсents').mockReturnValueOnce(2);

    const result = model.getMargin('from', modelSettings);
    expect(result).toBe(60);
  });

  test('shoul return 30000', () => {
    modelSettings.step = 0.003;
    const model = new Model(modelSettings);
    jest.spyOn(model as unknown as ModelHint, 'getOnePointInPerсents').mockReturnValueOnce(1);

    const result = model.getMargin('from', modelSettings);
    expect(result).toBe(30000);
  });

  test('shoul return 70000', () => {
    modelSettings.step = 0.003;
    const model = new Model(modelSettings);
    jest.spyOn(model as unknown as ModelHint, 'getOnePointInPerсents').mockReturnValueOnce(1);

    const result = model.getMargin('to', modelSettings);
    expect(result).toBe(70000);
  });
});
