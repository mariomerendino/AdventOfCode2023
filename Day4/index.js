const fs = require('fs')

const file = process?.argv[2] === '-t' ? 'testinput.txt' : 'input.txt'

fs.readFile(file, 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const arrayOfInputs = data.split("\n")
  // const ans = partOne(arrayOfInputs);
  const ans = partTwo(arrayOfInputs);
  console.log(ans);
});

const parseCard = (card) => {
    let [, data] = card.split(":")
    // single digit numbers have 2 spaces before them, remove it.
    data = data.replace(/\s+/g, " ")
    let [winningNums, playedNums] = data.split('|');
    winningNums = new Set(winningNums.trim().split(' '));
    playedNums = playedNums.trim().split(' ');
    return [winningNums, playedNums];
}

const partOne = (input) => {
    let total = 0;
    input.forEach((card) => {
        let points = 0;
        let numCardsMatched = 0;
        const [winningNumSet, playedNums] = parseCard(card);
        playedNums.forEach((playedNum) => {
            if(winningNumSet.has(playedNum)) {
                numCardsMatched++;
                if(numCardsMatched === 1) {
                    points += 1;
                }
                else if(numCardsMatched > 1) {
                    points = points * 2;
                }
            }
        })
        total += points;
    });
    return total;
}

const partTwo = (input) => {
    const cardsCount = new Array(input.length).fill(1);

    input.forEach((card, cardIdx) => {
        let numCardsMatched = 0;
        const [winningNumSet, playedNums] = parseCard(card);
        playedNums.forEach((playedNum) => {
            if(winningNumSet.has(playedNum)) {
                numCardsMatched++;
            }
        });

        for(let i = cardIdx + 1; i <= cardIdx + numCardsMatched; i++) {
            cardsCount[i] += cardsCount[cardIdx];
        }
        console.log({cardsCount});
    })


    return cardsCount.reduce((reducer, val) => {
        return reducer + val;
    }, 0)
};