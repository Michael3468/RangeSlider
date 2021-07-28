/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import './index.scss';
import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 100,
  max: 150,
  valueFrom: 140,
  valueTo: 149,
  isScaleVisible: true,
  isVertical: false,
  step: 40,
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 150,
  valueFrom: 35,
  valueTo: 50,
  isTwoRunners: false,
});

$('#range-slider3').RangeSlider({
  min: 100,
  max: 150,
  valueFrom: 120,
  valueTo: 149,
  isScaleVisible: true,
  isVertical: false,
  isTooltipsVisible: false,
  step: 25,
});
