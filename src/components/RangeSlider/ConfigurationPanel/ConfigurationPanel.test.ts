/**
 * @jest-environment jsdom
 */

/* eslint-disable dot-notation */

import { ISettings } from '../RangeSlider/types';
import ConfigurationPanel from './ConfigurationPanel';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    step: 10,
    valueFrom: 1000,
    valueTo: 1490,
    isVertical: true,
    isTwoRunners: true,
    isScaleVisible: true,
    isBarVisible: true,
    isTooltipsVisible: true,
    isConfPanel: true,

  };
});

describe('private addListeners', () => {
  it('should change values and add listeners', () => {
    const confPanel = new ConfigurationPanel(settings);
    const nObsSpy = jest
      .spyOn(confPanel.changeConfPanelSettingsObserver, 'notifyObservers');

    if (confPanel['cpMin']) {
      confPanel['cpMin'].value = String(100);
    }
    if (confPanel['cpMax']) {
      confPanel['cpMax'].value = String(100);
    }
    if (confPanel['cpStep']) {
      confPanel['cpStep'].value = String(100);
    }
    if (confPanel['cpFrom']) {
      confPanel['cpFrom'].value = String(100);
    }
    if (confPanel['cpTo']) {
      confPanel['cpTo'].value = String(100);
    }

    if (confPanel['cpVertical']) {
      confPanel['cpVertical'].checked = false;
    }
    if (confPanel['cpRange']) {
      confPanel['cpRange'].checked = false;
    }
    if (confPanel['cpScale']) {
      confPanel['cpScale'].checked = false;
    }
    if (confPanel['cpBar']) {
      confPanel['cpBar'].checked = false;
    }
    if (confPanel['cpTips']) {
      confPanel['cpTips'].checked = false;
    }

    const result = confPanel['addListeners']();

    /* number inputs */
    // cpMin listener
    if (result['cpMin']) {
      result['cpMin'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].min)).toBe(result['cpMin'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpMin listener end

    // cpMax listener
    if (result['cpMax']) {
      result['cpMax'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].max)).toBe(result['cpMax'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpMax listener end

    // cpStep listener
    if (result['cpStep']) {
      result['cpStep'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].step)).toBe(result['cpStep'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpStep listener end

    // cpFrom listener
    if (result['cpFrom']) {
      result['cpFrom'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].valueFrom)).toBe(result['cpFrom'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpFrom listener end

    // cpTo listener
    if (result['cpTo']) {
      result['cpTo'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].valueTo)).toBe(result['cpTo'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpTo listener end

    /* checkbox inputs */
    // cpVertical listener
    if (result['cpVertical']) {
      result['cpVertical'].dispatchEvent(new Event('change'));
      expect(result['settings'].isVertical).toBe(result['cpVertical'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpVertical listener end

    // cpRange listener
    if (result['cpRange']) {
      result['cpRange'].dispatchEvent(new Event('change'));
      expect(result['settings'].isTwoRunners).toBe(result['cpRange'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpRange listener end

    // cpScale listener
    if (result['cpScale']) {
      result['cpScale'].dispatchEvent(new Event('change'));
      expect(result['settings'].isScaleVisible).toBe(result['cpScale'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpScale listener end

    // cpBar listener
    if (result['cpBar']) {
      result['cpBar'].dispatchEvent(new Event('change'));
      expect(result['settings'].isBarVisible).toBe(result['cpBar'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpBar listener end

    // cpTips listener
    if (result['cpTips']) {
      result['cpTips'].dispatchEvent(new Event('change'));
      expect(result['settings'].isTooltipsVisible).toBe(result['cpTips'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpTips listener end
  });
});

describe('private getThumbFromDisabledStatus', () => {
  it('should return false if cpRange.checked === true', () => {
    settings.isTwoRunners = true;
    const confPanel = new ConfigurationPanel(settings);
    const result = confPanel['getThumbFromDisabledStatus']();
    expect(result).toBeFalsy();
  });

  it('should return true if cpRange.checked === false', () => {
    settings.isTwoRunners = false;
    const confPanel = new ConfigurationPanel(settings);
    const result = confPanel['getThumbFromDisabledStatus']();
    expect(result).toBeTruthy();
  });
});

describe('public updateState', () => {
  beforeEach(() => {
    settings = {
      min: 0,
      max: 1,
      step: 0.001,
      valueFrom: 0.001,
      valueTo: 0.003,
      isVertical: false,
      isTwoRunners: true,
      isScaleVisible: true,
      isBarVisible: true,
      isTooltipsVisible: true,
      isConfPanel: true,
    };
  });

  test('', () => {
    const confPanel = new ConfigurationPanel(settings);

    const updatedSettings: ISettings = {
      min: 0.001,
      max: 0.009,
      step: 0.002,
      valueFrom: 0.003,
      valueTo: 0.005,
      isVertical: true,
      isTwoRunners: false,
      isScaleVisible: false,
      isBarVisible: false,
      isTooltipsVisible: false,
      isConfPanel: false,
    };

    const result = confPanel['updateState'](updatedSettings);

    expect(result['cpMin'].value).toBe(String(updatedSettings.min));
    expect(result['cpMin'].max).toBe(String(updatedSettings.valueFrom));

    expect(result['cpMax'].value).toBe(String(updatedSettings.max));
    expect(result['cpMax'].min).toBe(String(updatedSettings.valueTo));

    expect(result['cpStep'].value).toBe(String(updatedSettings.step));

    expect(result['cpFrom'].value).toBe(String(updatedSettings.valueFrom));
    expect(result['cpFrom'].min).toBe(String(updatedSettings.min));
    expect(result['cpFrom'].step).toBe(String(updatedSettings.step));
    expect(result['cpFrom'].max).toBe(String(updatedSettings.valueTo));

    expect(result['cpTo'].value).toBe(String(updatedSettings.valueTo));
    expect(result['cpTo'].min).toBe(String(updatedSettings.valueFrom));
    expect(result['cpTo'].step).toBe(String(updatedSettings.step));
    expect(result['cpTo'].max).toBe(String(updatedSettings.max));

    expect(result['cpVertical'].checked).toBe(updatedSettings.isVertical);
    expect(result['cpRange'].checked).toBe(updatedSettings.isTwoRunners);
    expect(result['cpScale'].checked).toBe(updatedSettings.isScaleVisible);
    expect(result['cpBar'].checked).toBe(updatedSettings.isBarVisible);
    expect(result['cpTips'].checked).toBe(updatedSettings.isTooltipsVisible);
  });
});
