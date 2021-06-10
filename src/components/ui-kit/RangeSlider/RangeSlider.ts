import './RangeSlider.scss';
import { Observer } from './Observer';

const slider = document.querySelector('#slider');
let thumb: HTMLElement | null;

if (slider) {
  thumb = slider.querySelector('.thumb');
  if (thumb) {
    thumb.onpointerdown = beginSliding;
    thumb.onpointerup = stopSliding;
  }
}

function beginSliding(event: any) {
  event.preventDefault();

  if (thumb) {
    thumb.setPointerCapture(event.pointerId);

    let shiftX = event.clientX - thumb.getBoundingClientRect().left;

    thumb.onpointermove = function (event: any) {
      if (slider && thumb) {
        let newLeft =
          event.clientX - shiftX - slider.getBoundingClientRect().left;
        if (newLeft < 0) {
          newLeft = 0;
        }

        let rightEdge = slider.offsetWidth - thumb.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        thumb.style.left = newLeft + 'px';
      }
    };
  }
}

function stopSliding(event: any) {
  if (thumb) {
    thumb.onpointermove = null;
    thumb.releasePointerCapture(event.pointerId);
  }
}

// observer test code
const observer = new Observer();
observer.addObserver((data?: any) => {
  for (let i = 0; i < 10; i++) {
    if (data) {
      console.log('i: ' + i + ' - data: ' + data);
    } else {
      console.log('i: ' + i);
    }
  }
});
observer.notifyObservers();
// observer test code end
