import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider('init', {
  min: 0.0001,
  max: 0.0009,
  valueFrom: 0.00031,
  valueTo: 0.004,
  isScaleVisible: true,
  step: 0.00001,
  isConfPanel: true,
});

$('#range-slider2').RangeSlider('init', {
  min: 22,
  max: 150,
  valueTo: 54,
  isTwoRunners: false,
  step: 7,
  isConfPanel: true,
});

$('#range-slider3').RangeSlider('init', {
  min: 1,
  max: 2,
  valueFrom: 1.2,
  valueTo: 1.5,
  isScaleVisible: true,
  isVertical: true,
  isTwoRunners: true,
  step: 0.12,
  isConfPanel: true,
});

$('#range-slider4').RangeSlider('init', {
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
