/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import './index.scss';
import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 148,
  max: 150,
  fromValue: 148,
  toValue: 149,
  isScaleVisible: true,
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 150,
  fromValue: 35,
  toValue: 50,
  isTwoRunners: false,
});
