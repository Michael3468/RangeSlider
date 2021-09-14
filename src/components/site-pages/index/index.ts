/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import './index.scss';
import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 0,
  max: 1502,
  valueFrom: 1000,
  valueTo: 1492,
  isScaleVisible: true,
  step: 1,
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 150,
  valueTo: 54,
  isTwoRunners: false,
  step: 7,
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
});
