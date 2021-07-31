/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import './index.scss';
import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 0,
  max: 1500,
  valueFrom: 1000,
  valueTo: 1490,
  isScaleVisible: true,
  step: 10,
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 150,
  valueFrom: 35,
  valueTo: 50,
  isTwoRunners: false,
  step: 7,
});

$('#range-slider3').RangeSlider({
  min: 10000,
  max: 15000,
  valueFrom: 12000,
  valueTo: 14900,
  isScaleVisible: true,
  isVertical: true,
  step: 27,
});
