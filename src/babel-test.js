// test 1. @babel/polyfill
async function start() {
  // eslint-disable-next-line no-return-await
  return await Promise.resolve('async is working');
}
start().then(console.log);

// test 2. @babel/plugin-proposal-class-properties
class Util {
  static id = Date.now();
}
console.log('Util id: ', Util.id);