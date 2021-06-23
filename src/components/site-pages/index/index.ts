import './index.scss';
import '../../RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 20,
  max: 50,
  thumb_from_value: 33,
  thumb_to_value: 45
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 55,
  thumb_from_value: 35,
  thumb_to_value: 44
});
