const fs = require('fs')

const file = process?.argv[2] === '-t' ? 'testinput.txt' : 'input.txt'

fs.readFile(file, 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const arrayOfInputs = data.split("\n")
  // const ans = part1(arrayOfInputs);
  const ans = part2(arrayOfInputs);
  console.log(ans);
});

const buildRaces = (input) => {
    // lmao wut
    milliSecondsArr = input[0].split(':')[1].replace(/\s+/g, ' ').trim().split(' ').map((str) => Number(str.trim()));
    distancesArr = input[1].split(':')[1].replace(/\s+/g, ' ').trim().split(' ').map((str) => Number(str.trim()));

    return milliSecondsArr.map((milliSeconds, idx) => {
        return {
            milliSeconds,
            distance: distancesArr[idx]
        }
    });
}

const part1 = (input) => {
    const races = buildRaces(input);
    let result = null;
    races.forEach((race) => {
        let waysToWin = 0
        for(let i = 1; i < race.milliSeconds; i++) {
            if(i * (race.milliSeconds - i) > race.distance) {
                waysToWin += 1;
            }
        }
        result = result === null || 0 ? waysToWin : result * waysToWin;
    })

    return result;
}


const buildRacePrt2 = (input) => {
    // lmao wut
    milliSeconds = Number(input[0].split(':')[1].replace(/\s+/g, '').trim());
    distance = Number(input[1].split(':')[1].replace(/\s+/g, '').trim());

    return {
        milliSeconds,
        distance,
    }
}

const part2 = (input) => {
    const race = buildRacePrt2(input);
    let waysToWin = 0;
    for(let i = 1; i < race.milliSeconds; i++) {
        if(i * (race.milliSeconds - i) > race.distance) {
            waysToWin += 1;
        }
    }
    return waysToWin;
}
