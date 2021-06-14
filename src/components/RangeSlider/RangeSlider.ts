import './RangeSlider.scss';

import {View} from './View';

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

const view: View = new View('#range-slider');
view.createRangeSlider();
