import './RangeSlider.scss';

import { Model } from '../Model/Model';
import { View } from '../View/View';
import { Presenter } from '../Presenter/Presenter';

declare global {
  interface JQuery {
    RangeSlider(arg?: any): JQuery;
  }
}

export interface ISettings {
  min: number;
  max: number;
  isTwoRunners: boolean;
  thumb_from_value: number;
  thumb_to_value: number;
}

(function ($) {
  let defaultSettings: ISettings = {
    min: 0,
    max: 100,
    isTwoRunners: true,
    thumb_from_value: 30,
    thumb_to_value: 70,
  };

  $.fn.RangeSlider = function (userOptions): any {
    let mergedSettings = $.extend({}, defaultSettings, userOptions);

    // get element id of the element
    let elementId: string | null = this[0] ? `#${this[0].id}` : null;

    const model: Model = new Model(mergedSettings);
    const view: View = new View(elementId);
    const presenter: Presenter = new Presenter(model, view);

    presenter.initRangeSlider();

    return this;
  };
})(jQuery);

// const slider = document.querySelector('#range-slider');
// let thumb_from: HTMLElement | null;
// let thumb_to: HTMLElement | null;

// if (slider) {
//   thumb_from = slider.querySelector('.range-slider__thumb_from');
//   thumb_to = slider.querySelector('.range-slider__thumb_to');

//   if (thumb_from) {
//     thumb_from.onpointerdown = beginSliding;
//     thumb_from.onpointerup = stopSliding;
//   }
//   if (thumb_to) {
//     thumb_to.onpointerdown = beginSliding;
//     thumb_to.onpointerup = stopSliding;
//   }
// }

// function beginSliding(event: any) {
//   event.preventDefault();

//   if (thumb_from) {
//     thumb_from.setPointerCapture(event.pointerId);

//     let shiftX = event.clientX - thumb_from.getBoundingClientRect().left;

//     thumb_from.onpointermove = function (event: any) {
//       if (slider && thumb_from) {
//         let newLeft =
//           event.clientX - shiftX - slider.getBoundingClientRect().left;
//         if (newLeft < 0) {
//           newLeft = 0;
//         }

//         let rightEdge = slider.offsetWidth - thumb_from.offsetWidth;
//         if (newLeft > rightEdge) {
//           newLeft = rightEdge;
//         }
//         thumb_from.style.left = newLeft + 'px';
//       }
//     };
//   }
// }

// function stopSliding(event: any) {
//   if (thumb_from) {
//     thumb_from.onpointermove = null;
//     thumb_from.releasePointerCapture(event.pointerId);
//   }
// }
