import './slider.scss';

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
  thumb.setPointerCapture(event.pointerId);

  let shiftX = event.clientX - thumb.getBoundingClientRect().left;

  thumb.onpointermove = function(event: any) {
    if (slider) {
      let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;
      if (newLeft < 0) {
        newLeft = 0;
      }
    
      let rightEdge = slider.offsetWidth - thumb.offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }
      thumb.style.left = newLeft + 'px';
    }
  }
}

function stopSliding(event: any) {
  thumb.onpointermove = null;
  thumb.releasePointerCapture(event.pointerId);
}
