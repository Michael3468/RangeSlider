import { createElement } from '../lib/common';
import Tooltip from '../Tooltip/Tooltip';

import {
  ThumbName,
  AbstractThumb,
  AbstractTooltip,
  IViewSettings,
} from '../RangeSlider/types';

class Thumb extends AbstractThumb {
  private name: ThumbName;

  element: HTMLElement;

  tooltip: AbstractTooltip;

  constructor(name: ThumbName) {
    super();
    this.name = name;
    this.tooltip = new Tooltip(this.name);

    this.element = createElement(
      'div',
      `thumb-${this.name}`,
      this.tooltip.element,
    );
  }

  public setMargin(margin: number, viewSettings: IViewSettings): Thumb {
    if (viewSettings.vertical) {
      this.element.style.marginTop = `${margin}px`;
      this.element.style.marginLeft = '0px';
    } else {
      this.element.style.marginTop = '0px';
      this.element.style.marginLeft = `${margin}px`;
    }
    return this;
  }
}

export default Thumb;
