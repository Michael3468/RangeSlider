import { createElement } from '../lib/common';
import Tooltip from '../Tooltip/Tooltip';

import {
  ThumbName,
  ISettings,
  AbstractThumb,
  AbstractTooltip,
} from '../RangeSlider/types';

class Thumb extends AbstractThumb {
  element: HTMLElement;

  tooltip: AbstractTooltip;

  constructor(private name: ThumbName) {
    super();
    this.name = name;
    this.tooltip = new Tooltip(this.name);

    this.element = createElement(
      'div',
      `thumb-${this.name}`,
      this.tooltip.element,
    );
  }

  public setMargin(margin: number, settings: ISettings): Thumb {
    if (settings.vertical) {
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
