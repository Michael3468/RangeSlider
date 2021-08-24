/* eslint-disable no-shadow */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import { ISettings, ThumbName } from '../RangeSlider/types';
import { Model } from './Model';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    isTwoRunners: true,
    isScaleVisible: true,
    isVertical: false,
    isTooltipsVisible: true,
    valueFrom: 1000,
    valueTo: 1490,
    step: 10,
  };
});

function getPrivateStaticMethod(methodName: string, settings: ISettings) {
  const modelProto = Model.prototype as any;
  const instance = Object.create(modelProto);
  return () => modelProto.constructor[methodName].call(instance, settings);
}

describe('function validateSettings: ', () => {
  test('"settings.min >= settings.max" should throw Error', () => {
    settings.min = 2000;
    settings.max = 1500;
    expect(getPrivateStaticMethod('validateSettings', settings)).toThrow();

    // eslint-disable-next-line no-multi-assign
    settings.min = settings.max = 1000;
    expect(getPrivateStaticMethod('validateSettings', settings)).toThrow();

    settings.min = 1000;
    settings.max = 1500;
    expect(getPrivateStaticMethod('validateSettings', settings)).not.toThrow();
  });

  test('"settings.valueFrom < settings.min" should throw Error', () => {
    settings.valueFrom = 700;
    settings.min = 1000;
    expect(getPrivateStaticMethod('validateSettings', settings)).toThrow();

    settings.valueFrom = 1300;
    settings.min = 1000;
    expect(getPrivateStaticMethod('validateSettings', settings)).not.toThrow();
  });

  test('"settings.valueFrom > settings.valueTo" should throw Error', () => {
    settings.valueFrom = 1200;
    settings.valueTo = 1100;
    expect(getPrivateStaticMethod('validateSettings', settings)).toThrow();

    settings.valueFrom = 1000;
    settings.valueTo = 1100;
    expect(getPrivateStaticMethod('validateSettings', settings)).not.toThrow();
  });

  test('"settings.valueTo > settings.max" should throw Error', () => {
    settings.valueTo = 1200;
    settings.max = 1100;
    expect(getPrivateStaticMethod('validateSettings', settings)).toThrow();

    settings.valueTo = 1200;
    settings.max = 1300;
    expect(getPrivateStaticMethod('validateSettings', settings)).not.toThrow();
  });

  test('"settings.max - settings.min < settings.step" should throw Error', () => {
    settings.max = 1500;
    settings.min = 1000;
    settings.step = 600;
    expect(getPrivateStaticMethod('validateSettings', settings)).toThrow();

    settings.max = 1500;
    settings.min = 1000;
    settings.step = 400;
    expect(getPrivateStaticMethod('validateSettings', settings)).not.toThrow();
  });

  test('"settings.valueTo - settings.valueFrom < settings.step" should throw Error', () => {
    settings.valueTo = 1400;
    settings.valueFrom = 1000;
    settings.step = 500;
    expect(getPrivateStaticMethod('validateSettings', settings)).toThrow();

    settings.valueTo = 1400;
    settings.valueFrom = 1000;
    settings.step = 300;
    expect(getPrivateStaticMethod('validateSettings', settings)).not.toThrow();
  });
});

function getPrivateMethod(methodName: string, settings: ISettings, thumbName: ThumbName) {
  const modelProto = Model.prototype as any;
  const instance = Object.create(modelProto);
  return modelProto[methodName].call(instance, settings, thumbName);
}

describe('function getThumbValue:', () => {
  test('if thumbName == "from" should return settings.valueFrom', () => {
    const thumbName: ThumbName = 'from';
    const result = settings.valueFrom;
    expect(getPrivateMethod('getThumbValue', settings, thumbName)).toBe(result);
  });

  test('if thumbName == "to" should return settings.valueTo', () => {
    const thumbName: ThumbName = 'to';
    const result = settings.valueTo;
    expect(getPrivateMethod('getThumbValue', settings, thumbName)).toBe(result);
  });
});

function getStepInPercentsTest(settings: ISettings) {
  const modelProto = Model.prototype as any;
  const instance = Object.create(modelProto);
  return modelProto.getStepInPercents.call(instance, settings);
}

describe('function getSettings:', () => {
  test('check returned object', () => {
    const model = new Model(settings);
    const changedSettings = settings;
    changedSettings.rangePercent = (settings.max - settings.min) / 100;
    changedSettings.step = getStepInPercentsTest(settings);

    expect(model.getSettings()).toStrictEqual(changedSettings);
  });
});

describe('function getStepInPercents:', () => {
  test('check returned value', () => {
    settings.step = 10;
    const expectedStep = 0.6666666666666666;
    const step = getStepInPercentsTest(settings);
    expect(step).toBe(expectedStep);
  });
});
