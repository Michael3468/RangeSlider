/* eslint-disable dot-notation */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import '../../RangeSlider/RangeSlider/RangeSlider';

import './index.scss';

$('#range-slider').RangeSlider({
  min: 0,
  max: 1502,
  valueFrom: 1000,
  valueTo: 1492,
  isScaleVisible: true,
  step: 1,
  isConfPanel: true,
});

if (process.env['NODE_ENV'] !== 'production') {
  $('#range-slider2').RangeSlider({
    min: 22,
    max: 150,
    valueTo: 54,
    isTwoRunners: false,
    step: 7,
    isConfPanel: true,
  });

  $('#range-slider3').RangeSlider({
    min: 100,
    max: 550,
    valueFrom: 120,
    valueTo: 250,
    isScaleVisible: true,
    isVertical: true,
    isTwoRunners: true,
    step: 1,
    isConfPanel: true,
  });

  $('#range-slider4').RangeSlider({
    min: -100,
    max: 100,
    valueFrom: -20,
    valueTo: 70,
    isScaleVisible: true,
    isVertical: true,
    isTwoRunners: false,
    step: 1,
    isConfPanel: true,
    isBarVisible: false,
  });
}
