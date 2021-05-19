let x: number = 0;
console.log('this is x: ', x);
x = '';


type ID = string | number;
const id1:ID = 1234;
const id2:ID = '1234';
const id3:ID = {};

console.log('id1: ', id1);
console.log('id2: ', id2);
console.log('id3: ', id3);