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
//   const ans = part1();
  const ans = part2();
  console.log(ans);
});

const buildMap = () => {
    let map = {};
    for(let i = 2; i < input.length; i++) {
        let [key, rest] = input[i].split(' = ');
        let [left, right] = rest.split(', ');
        left = left.split('(')[1];
        right = right.split(')')[0];

        map[key] = {
            left,
            right,
        }
    }
    return map;
}

const part1 = () => {
    let map = buildMap();
    let stepInstructions = input[0].split('');
    console.log({map, stepInstructions});

    let currentStep = 'AAA';
    let stepIdx = 0;
    let stepCount = 0;
    while (currentStep != 'ZZZ') {
        if(stepInstructions[stepIdx] === 'L') {
            currentStep = map[currentStep]['left'];
        } else {
            currentStep = map[currentStep]['right'];
        }
        stepIdx++;
        if(stepIdx == stepInstructions.length) {
            stepIdx = 0;
        }
        stepCount++;
    }
    return(stepCount);
}

const lcm = (arr) => {
    const gcd = (x, y) => (!y ? x : gcd(y, x % y));
    const _lcm = (x, y) => (x * y) / gcd(x, y);
    return arr.reduce((a, b) => _lcm(a, b));
  };

const part2 = () => {
    let map = buildMap();
    let stepInstructions = input[0].split('');
    
    let currentSteps = []
    Object.keys(map).forEach((key) => {
        if(key[2] === 'A') {
            currentSteps.push(key)
        }
    });

    let stepIdx = 0;
    let stepCounts = Array(currentSteps.length).fill(0);

    console.log({currentSteps, stepCounts})

    for(let i = 0; i < currentSteps.length; i++) {
        while(currentSteps[i][2] != 'Z') {
            if(stepInstructions[stepIdx] === 'L') {
                currentSteps[i] = map[currentSteps[i]]['left'];
            } else {
                currentSteps[i] = map[currentSteps[i]]['right'];
            }
            stepCounts[i] += 1;
            stepIdx++;
            if(stepIdx == stepInstructions.length) {
                stepIdx = 0;
            }
        }
        stepIdx = 0;
    }
    
    return lcm(stepCounts);
}