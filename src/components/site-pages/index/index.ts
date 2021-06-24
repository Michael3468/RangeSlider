import './index.scss';
import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 20,
  max: 150,
  thumb_from_value: 30,
  thumb_to_value: 75
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 150,
  thumb_from_value: 35,
  thumb_to_value: 50,
  isTwoRunners: false
});
