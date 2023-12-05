const fs = require('fs')

const file = process?.argv[2] === '-t' ? 'testinput.txt' : 'input.txt'

fs.readFile(file, 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const arrayOfInputs = data.split("\n")
  //const ans = partOne(arrayOfInputs);
  const ans = partTwo(arrayOfInputs);
  console.log(ans);
});

function isNum(str) {
  return !isNaN(parseInt(str));
}
const isNearSymbol = (num, input, rowIdx, colIdx) => {
  let grid = ''
  let res = false;
  const numLength = String(num).length;
  // check around Number
  for(let i = rowIdx - 1; i < rowIdx + 2; i++ ){
    if(input[i] === undefined) {
      continue;
    }
    for(let j = colIdx - numLength - 1; j < colIdx + 1; j++) {
      let val = input[i][j];
      if(val == null) {
        continue;
      }
      else { 
        grid = grid + val;
        // skip current num
        if(i === rowIdx && (colIdx - numLength -1 < j && j < colIdx)) {
          continue;
        } else {
          // if value is a dot or a number than its near a symbol
          if (val != '.' && !isNum(val)) {
            res = true;
          }
        }
      }
    }
    grid = grid + '\n';
  }
  
  if(!res) {
    console.log(grid)
  }

  return res;
}

const partOne = (input) => {
  const numbers = [];
  const validNumbers = [];
  const invalidNumbers = [];
  let sum = 0;
  input.forEach((row, rowIdx) => {
    let temp = 0;
    let prevChar = null;
    row.split('').forEach((char, colIdx) => {
      const num = Number(char);
      const nextChar = row[colIdx + 1];
      if(!Number.isNaN(num)) {
        temp = (temp * 10) + num;
      }
      if(temp > 0 && (nextChar == null || !isNum(nextChar))) {
        if (isNearSymbol(temp, input, rowIdx, colIdx + 1)) {
          sum = sum + temp;
          validNumbers.push(temp);
        } else {
          invalidNumbers.push(temp)
        }
        numbers.push(temp);
        temp = 0;
      }
      prevChar = num;
    });
  });
  console.log({
    validNumbers,
    invalidNumbers,
  })
  return sum;
};

// set of seen indexes
let indexSet = new Set();

const buildIdx = (i, j) => `${i}_${j}`

const buildNum = (rowIdx, colIdx, input) => {
  let num = 0;
  //move left until we hit a non num char;
  let i = colIdx;
  let hitNon0 = false;
  while(!hitNon0) {
    if(isNum(input[rowIdx][i - 1])) {
      i = i - 1;
    }
    else {
      hitNon0 = true;
    }
  }

  // move right and build num until non num
  hitNon0 = false;
  while(!hitNon0) {
    indexSet.add(buildIdx(rowIdx, i));
    num = (num * 10) + Number(input[rowIdx][i]);
    if(isNum(input[rowIdx][i + 1])) {
      i = i + 1;
    }
    else {
      hitNon0 = true;
    }
  }
  return num;
}

const getNumsAround = (rowIdx, colIdx, input) => {
  const nums = [];
  for(let i = rowIdx - 1; i <= rowIdx + 1; i++ ){
    // skip rows that are too high or low.
    if(input[i] === undefined) {
      continue;
    }
    for(let j = colIdx - 1; j <= colIdx + 1; j++) {
      if(i === rowIdx && j === colIdx) {
        continue;
      }
      let val = input[i][j];
      // if the value is a number build it and we already havent seen it
      if(isNum(val) && !indexSet.has(buildIdx(i, j))) {
        nums.push(buildNum(i, j, input));
      }
    }
  }
  indexSet = new Set();
  return nums;
}


const partTwo = (input) => {
  let sum = 0;
  input.forEach((row, rowIdx) => {
    row.split('').forEach((char, colIdx) => {
      if(char === '*') {
        const nums = getNumsAround(rowIdx, colIdx, input);
        console.log({
          gearLocation: [rowIdx, colIdx],
          nums,
        })
        if(nums.length >= 2) {
          let tmp = 1
          for (let i = 0; i < nums.length; i++) {
            tmp *=nums[i]
          }
          sum += tmp
        }
      }
    })
  })
  return sum;
}
