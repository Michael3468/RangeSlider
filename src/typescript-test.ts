let x: number = 0;
console.log('this is x: ', x);
x = '';

type ID = string | number;
const id1: ID = 1234;
const id2: ID = '1234';
const id3: ID = {};

console.log('id1: ', id1);
console.log('id2: ', id2);
// console.log('id3: ', id3);

// укажем тип this первым «аргументом»
// фактически это не будет считаться аргументом функции
function sayHello(this: HelloStyle, name: string) {
  console.log(this.helloWord + ' ' + name);
}

// объявим варианты приветствий
interface HelloStyle {
  helloWord: string;
}

class HawaiiStyle implements HelloStyle {
  helloWord = 'Aloha';
}

class RussianStyle implements HelloStyle {
  helloWord = 'Привет,';
}

// allowUnreachableCode
// теперь вызовем
sayHello.bind(new HawaiiStyle())('World');
sayHello.call(new RussianStyle(), 'World');
sayHello.apply(new RussianStyle(), ['World']);

function fn (n: number) {
  if (n > 5) {
    return true
  } else {
    return false
  }

  // недосягаемый код
  return true
}
