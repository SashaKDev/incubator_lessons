function myFunction(x, y, z) {return x + y + z}
const args = [0, 1, 2];
const args2 = [0, 1, 2, 3];
const copy = [...args, ...args2]
console.log(copy)