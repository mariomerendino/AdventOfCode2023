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

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

const parseSubGame = (subGame) => {
    const map = {};
    let colors = subGame.split(',');
    colors.forEach((colorAndValue) => {
        let trimmed = colorAndValue.trim();
        const [num, color] = trimmed.split(' ');
        map[color] = Number(num)
    });
    return map;
}

const part1 = (input) => {
    let sum = 0;
    input.forEach((game, index) => {
        let isPossible = true;
        const gameNum = index + 1;
        const [_x, gameData] = game.split(':');
        const subGames = gameData.split(';').map((subGame) => subGame.trim());
        subGames.forEach((subGame) => {
            let map = parseSubGame(subGame);
            if(map['green'] && (map['green'] > MAX_GREEN)) {
                isPossible = false;
            }
            if(map['red'] && (map['red'] > MAX_RED)) {
                isPossible = false;
            }
            if(map['blue'] && (map['blue'] > MAX_BLUE)) {
                isPossible = false;
            }
        })
        if(isPossible) {
            sum = gameNum + sum;
        }

    })
    return sum;
};

const part2 = (input) => {
    let sum = 0;
    input.forEach((game, index) => {
        const [_x, gameData] = game.split(':');
        const subGames = gameData.split(';').map((subGame) => subGame.trim());
        let minReqRed = 0;
        let minReqBlue = 0;
        let minReqGreen = 0;
        subGames.forEach((subGame) => {
            let map = parseSubGame(subGame);
            if(map['green'] && (map['green'] > minReqGreen)) {
                minReqGreen = map['green'];
            }
            if(map['red'] && (map['red'] > minReqRed)) {
                minReqRed = map['red'];
            }
            if(map['blue'] && (map['blue'] > minReqBlue)) {
                minReqBlue = map['blue'];
            }
        })
        console.log({ minReqGreen, minReqRed,  minReqBlue, powerSet: minReqGreen * minReqRed * minReqBlue} );
        sum = sum + (minReqGreen * minReqRed * minReqBlue);
    })
    return sum;
};