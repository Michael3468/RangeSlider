import './index.scss';
import '../../RangeSlider/RangeSlider/RangeSlider';

$('#range-slider').RangeSlider({
  min: 20,
  max: 50,
  thumb_from_value: 10,
  thumb_to_value: 80
});

$('#range-slider2').RangeSlider({
  min: 22,
  max: 55,
  thumb_from_value: 35,
  thumb_to_value: 70
});
