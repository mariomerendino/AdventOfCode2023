const fs = require('fs')

const fileNum = process?.argv[3] === '-n' ? '2' : ''
const file = process?.argv[2] === '-t' ? `testinput${fileNum}.txt` : 'input.txt'

let input = [];

fs.readFile(file, 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  input = data.split("\n")
  // const ans = part1();
  const ans = part2();
  console.log(ans);
});

const getNextValue = (arr) => {
  let sequences = [];
  sequences.push(arr);
  let allZeros = false;
  let arrayIdx = 0;

  while(!allZeros) {
    allZeros = true
    let newArr = []
    let currArr = sequences[arrayIdx];
    for(let i = 0; i < currArr.length - 1; i++) {
      let val = currArr[i+1] - currArr[i]
      newArr.push(val)
      if(val != 0) {
        allZeros = false
      }
    }
    arrayIdx++;
    sequences.push(newArr);
  }

  // add a zero to the end of the last sequence
  sequences[sequences.length -1].push(0);
  // work our way up.
  for(let i = sequences.length - 2; i !== -1; i--) {
    curr = sequences[i];
    prev = sequences[i + 1];

    curr.push(curr[curr.length - 1] + prev[prev.length -1]);
  }

  console.log(sequences);
  return sequences[0][sequences[0].length -1];
}

const part1 = () => {
  // for debugging
  let nextValues = [];
  let sum = 0;
  for(let i = 0; i < input.length; i++) {
    let arr = input[i].split(' ').map((x) => Number(x));
    let nextVal = getNextValue(arr);
    sum += nextVal
    nextValues.push(nextVal);
  }
  console.log(nextValues);
  return sum;
}

// Stolen from getNextValue except for the last bit
const getPrevValue = (arr) => {
  let sequences = [];
  sequences.push(arr);
  let allZeros = false;
  let arrayIdx = 0;

  while(!allZeros) {
    allZeros = true
    let newArr = []
    let currArr = sequences[arrayIdx];
    for(let i = 0; i < currArr.length - 1; i++) {
      let val = currArr[i+1] - currArr[i]
      newArr.push(val)
      if(val != 0) {
        allZeros = false
      }
    }
    arrayIdx++;
    sequences.push(newArr);
  }


  // this is where its different from getNextValue
  // add a zero to the front of the last sequence
  sequences[sequences.length -1].unshift(0);
  // work our way up.
  for(let i = sequences.length - 2; i !== -1; i--) {
    curr = sequences[i];
    prev = sequences[i + 1];

    curr.unshift(curr[0] - prev[0]);
  }

  return sequences[0][0];
}

const part2 = () => {
  // for debugging
  let prevValues = [];
  let sum = 0;
  for(let i = 0; i < input.length; i++) {
    let arr = input[i].split(' ').map((x) => Number(x));
    let prevVal = getPrevValue(arr);
    sum += prevVal
    prevValues.push(prevVal);
  }
  console.log(prevValues);
  return sum;
}