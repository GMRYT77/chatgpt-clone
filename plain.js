let arr = [1, 1, 1, 1, 2, 2, 3, 4];
let dict = {};

arr.map((e) => {
  dict[e] = true;
});

console.log(dict);
