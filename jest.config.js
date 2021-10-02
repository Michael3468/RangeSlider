const { defaults } = require('jest-config');

module.exports = {
  setupFilesAfterEnv: ['./src/components/RangeSlider/lib/setupEvents'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'd.ts'],
};
