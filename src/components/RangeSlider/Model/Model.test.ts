/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import { ISettings } from '../RangeSlider/types';
import { Model } from './Model';

let settings: ISettings;

// eslint-disable-next-line no-shadow
function getPrivateStaticMethod(methodName: string, settings: ISettings) {
  const modelProto = Model.prototype as any;
  const instance = Object.create(modelProto);
  return () => modelProto.constructor[methodName].call(instance, settings);
}

describe('function validateSettings: ', () => {
  beforeEach(() => {
    settings = {
      min: 0,
      max: 1500,
      valueFrom: 1000,
      valueTo: 1490,
      isScaleVisible: true,
      isTwoRunners: true,
      isVertical: false,
      isTooltipsVisible: true,
      step: 10,
    };
  });

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
