/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import './index.scss';
import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 20,
  max: 150,
  fromValue: 40,
  toValue: 75,
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 150,
  fromValue: 35,
  toValue: 50,
  isTwoRunners: false,
});
