import { getDigitsAfterPoint, getMinStep } from '../lib/common';
import { ISettings, ThumbName } from '../RangeSlider/types';

class Model {
  private settings: ISettings;

  constructor(settings: ISettings) {
    this.settings = Model.validateSettings(settings);
    this.settings.stepInPrecents = this.getStepInPercents(this.settings);
  }

  public getSettings(): ISettings {
    return this.settings;
  }

  public updateSettings(settings: ISettings): ISettings {
    this.settings = Model.validateSettings(settings);
    return this.settings;
  }

  public getPosWithStepInPercents(settings: ISettings): number {
    const curPos = settings.currentPos;
    const stepInPercents = this.getStepInPercents(settings);
    let posWithStep = 0;

    if (curPos && curPos < 100 && curPos > 0) {
      const remains = curPos % stepInPercents;

      if (remains >= (stepInPercents / 2)) {
        posWithStep = curPos - remains + stepInPercents;
      } else {
        posWithStep = curPos - remains;
      }
    } else if (curPos === 100 || curPos === 0) {
      posWithStep = curPos;
    }

    this.settings.posWithStepInPercents = posWithStep;
    return posWithStep;
  }

  public getThumbValue(settings: ISettings): number {
    const curPosInPercents = <number> this.settings.posWithStepInPercents;
    const onePointInPercents = this.getOnePointInPersents(settings);

    const curPosInPoints = Number((curPosInPercents / onePointInPercents)
      .toFixed(getDigitsAfterPoint(settings)));

    const thumbValue = settings.step < 1
      ? curPosInPoints * getMinStep(settings) + settings.min
      : curPosInPoints + settings.min;

    return thumbValue;
  }

  public getMargin(thumbName: ThumbName, settings: ISettings): number {
    const onePointInPercents = this.getOnePointInPersents(settings);

    const value = thumbName === 'from'
      ? settings.from
      : settings.to;

    let margin: number;
    if (settings.step >= 1) {
      margin = (value - settings.min) * onePointInPercents;
    } else {
      margin = ((value - settings.min)
      / getMinStep(settings))
      * onePointInPercents;
    }

    const rounderMargin = Number(margin.toFixed(getDigitsAfterPoint(settings)));
    return rounderMargin;
  }

  public getStepInPercents(settings: ISettings): number {
    const onePointInPercents = this.getOnePointInPersents(settings);

    return settings.step >= 1
      ? onePointInPercents * settings.step
      : onePointInPercents * (settings.step / getMinStep(settings));
  }

  private getOnePointInPersents(settings: ISettings): number {
    const points = settings.max - settings.min;

    return settings.step >= 1
      ? 100 / points
      : 100 / (points / getMinStep(settings));
  }

  private static validateSettings(settings: ISettings): ISettings {
    if (settings.step <= 0) {
      settings.step = 1;
    }

    if (settings.min >= settings.max) {
      settings.min = settings.max - settings.step;
    }

    if ((settings.max - settings.min) < settings.step) {
      settings.step = settings.max - settings.min;
    }

    if (settings.from < settings.min) {
      settings.from = settings.min;
    }

    if (settings.from > settings.max) {
      settings.from = settings.max;
    }

    if (settings.to < settings.from) {
      settings.to = settings.from;
    }

    if (settings.to > settings.max) {
      settings.to = settings.max;
    }

    if ((settings.to - settings.from) < settings.step) {
      if (settings.from >= (settings.min + settings.step)) {
        settings.from = settings.to - settings.step;
      } else {
        settings.to = settings.from + settings.step;
      }
    }

    return settings;
  }
}

export default Model;
