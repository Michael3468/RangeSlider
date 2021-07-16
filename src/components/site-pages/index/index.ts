/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import './index.scss';
import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 148,
  max: 150,
  valueFrom: 148,
  valueTo: 149,
  isScaleVisible: true,
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 150,
  valueFrom: 35,
  valueTo: 50,
  isTwoRunners: false,
});
