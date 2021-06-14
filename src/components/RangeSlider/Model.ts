export class Model {
  twoRunners: boolean;
  minValue: number;
  maxValue: number;

  constructor() {
    // default options
    this.twoRunners = true;
    this.minValue = 0;
    this.maxValue = 100;
  }

  getOptions() {
    return {
      twoRunners: this.twoRunners,
      minValue: this.minValue,
      maxValue: this.maxValue,
    };
  }
}
