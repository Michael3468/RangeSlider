import { getDigitsAfterPoint, getMinStep } from '../lib/common';
import { IModelSettings, ThumbName } from '../RangeSlider/types';

class Model {
  private settings: IModelSettings;

  constructor(settings: IModelSettings) {
    this.settings = Model.validateSettings(settings);
    this.settings.stepInPercents = this.getStepInPercents(this.settings);
  }

  public getSettings(): IModelSettings {
    return this.settings;
  }

  public updateSettings(settings: IModelSettings): IModelSettings {
    this.settings = Model.validateSettings(settings);
    return this.settings;
  }

  public getPosWithStepInPercents(settings: IModelSettings): number {
    const curPos = settings.currentPos;
    let posWithStep = 0;

    const START_POINT_IN_PERCENTS = 0;
    const END_POINT_IN_PERCENTS = 100;

    const isCurPosInsideSlider = curPos
      && curPos < END_POINT_IN_PERCENTS
      && curPos > START_POINT_IN_PERCENTS;

    if (isCurPosInsideSlider) {
      const stepInPercents = this.getStepInPercents(settings);
      const remains = curPos % stepInPercents;

      const isRemainsBiggerOrEqualThanHalfStep = remains >= (stepInPercents / 2);
      const isRemainsBiggerThanCurPosTillEndPoint = ((END_POINT_IN_PERCENTS - curPos) < remains);

      if (isRemainsBiggerOrEqualThanHalfStep || isRemainsBiggerThanCurPosTillEndPoint) {
        posWithStep = curPos - remains + stepInPercents;
      } else {
        posWithStep = curPos - remains;
      }
    } else if (curPos === END_POINT_IN_PERCENTS || curPos === START_POINT_IN_PERCENTS) {
      posWithStep = curPos;
    }

    posWithStep = posWithStep > END_POINT_IN_PERCENTS ? END_POINT_IN_PERCENTS : posWithStep;

    this.settings.posWithStepInPercents = posWithStep;
    return posWithStep;
  }

  public getThumbValue(settings: IModelSettings): number {
    const curPosInPercents = this.settings.posWithStepInPercents;
    const onePointInPercents = this.getOnePointInPerсents(settings);

    const curPosInPoints = Number((curPosInPercents / onePointInPercents)
      .toFixed(getDigitsAfterPoint(settings)));

    const thumbValue = settings.step < 1
      ? curPosInPoints * getMinStep(settings) + settings.min
      : curPosInPoints + settings.min;

    return thumbValue;
  }

  public getMargin(thumbName: ThumbName, settings: IModelSettings): number {
    const onePointInPercents = this.getOnePointInPerсents(settings);

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

  public getStepInPercents(settings: IModelSettings): number {
    const onePointInPercents = this.getOnePointInPerсents(settings);

    return settings.step >= 1
      ? onePointInPercents * settings.step
      : onePointInPercents * (settings.step / getMinStep(settings));
  }

  private getOnePointInPerсents(settings: IModelSettings): number {
    const points = settings.max - settings.min;

    return settings.step >= 1
      ? 100 / points
      : 100 / (points / getMinStep(settings));
  }

  private static validateSettings(settings: IModelSettings): IModelSettings {
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
      } else if ((settings.from + settings.step) >= settings.max) {
        settings.to = settings.max;
        settings.from = settings.max - settings.step;
      } else {
        settings.to = settings.from + settings.step;
      }
    }

    return settings;
  }
}

export default Model;
