import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider('init', {
  min: 0.0001,
  max: 0.0009,
  from: 0.00031,
  to: 0.004,
  scale: true,
  step: 0.00001,
  confpanel: true,
});

$('#range-slider2').RangeSlider('init', {
  min: 22,
  max: 150,
  to: 54,
  range: false,
  step: 7,
  confpanel: true,
});

$('#range-slider3').RangeSlider('init', {
  min: 1,
  max: 2,
  from: 1.2,
  to: 1.5,
  scale: true,
  vertical: true,
  range: true,
  step: 0.12,
  confpanel: true,
});

$('#range-slider4').RangeSlider('init', {
  min: -100,
  max: 100,
  from: -20,
  to: 70,
  scale: true,
  vertical: true,
  range: false,
  step: 1,
  confpanel: true,
  bar: false,
});
