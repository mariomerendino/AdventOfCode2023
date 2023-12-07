const fs = require('fs')

const file = process?.argv[2] === '-t' ? 'testinput.txt' : 'input.txt'

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


const debugType =[
    'five of a kind',
    'four of a kind',
    'full house',
    'three of a kind',
    'two pair',
    'one pair',
    'high card',
]
/**
 * 0 -> five of a kind,
 * 1 -> four of a kind,
 * 2 -> Full house
 * 3 -> Three of a kind,
 * 4 -> Two pair
 * 5 -> One pair
 * 6 -> high card
 * @param {*} hand 
 */
const getType = (hand) => {
    let handMap = {};
    for(let i = 0; i < hand.length; i++) {
        handMap[hand[i]] = handMap[hand[i]] ?  handMap[hand[i]] + 1 : 1;
    }
    const cardNums = Object.keys(handMap);
    if(cardNums.length === 1) {
        return 0;
    }
    if(cardNums.length === 2) {
        if(handMap[cardNums[0]] === 4 || handMap[cardNums[1]] === 4){
            return 1
        }
        return 2;
    }
    if(cardNums.length == 3) {
        if(handMap[cardNums[0]] === 3 || handMap[cardNums[1]] === 3 || handMap[cardNums[2]] === 3) {
            return 3;
        }
        return 4;
    }
    if(cardNums.length == 4) {
        return 5;
    }
    return 6;
}

/**
 * 0 -> five of a kind,
 * 1 -> four of a kind,
 * 2 -> Full house
 * 3 -> Three of a kind,
 * 4 -> Two pair
 * 5 -> One pair
 * 6 -> high card
 * @param {*} hand 
 */
// J is now a wildCard
const getType2 = (hand) => {
    let handMap = {};
    for(let i = 0; i < hand.length; i++) {
        handMap[hand[i]] = handMap[hand[i]] ?  handMap[hand[i]] + 1 : 1;
    }
    const cardNums = Object.keys(handMap);
    const cardCounts = Object.values(handMap)
    const numberOfJokers = handMap["J"] ?? 0;
    if(cardNums.length === 1) {
        return 0;
    }
    if(cardNums.length === 2) {
        if(numberOfJokers > 0) {
            return 0;
        }
        if(cardCounts.includes(4)){
            return 1
        }
        return 2;
    }
    if(cardNums.length == 3) {
        if(numberOfJokers > 0) {
            if(cardCounts.includes(3) || cardCounts.includes(2) && numberOfJokers == 2) {
                return 1;
            }
            if(numberOfJokers == 1) {
                return 2
            }
        }
        if(cardCounts.includes(3)) {
            return 3;
        }
        return 4;
    }
    if(cardNums.length == 4) {
        if(numberOfJokers > 0) {
            return 3;
        }
        return 5;
    }
    if(numberOfJokers > 0) {
        return 5;
    }
    return 6
}

const buildHandAndBids = (isPart2) => {
    return input.map((line) => {
        const x = line.split(' ')
        const type = isPart2 ? getType2(x[0]) : getType(x[0])
        return {
            hand: x[0],
            bid: Number(x[1]),
            type: type,
            debugType: debugType.at(type),
        }
    })
}

const groupBytype = (handsAndBids) =>{
    return handsAndBids.reduce((group, handAndBid) => {
        const { debugType } = handAndBid;
        group[debugType] = group[debugType] ?? [];
        group[debugType].push(handAndBid);
        return group;
    }, {});
}

let cardToNumMap = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2
}
let cardToNumMap2 = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    'J': 1,
}

const sorted = (groupedByType, part2) => {
    const map = part2 ? cardToNumMap2 : cardToNumMap
    debugType.forEach((type) => {
        let arr = groupedByType[type];
        if(arr) {
            groupedByType[type] = arr.sort((a, b) => {
                if(a.hand === b.hand) {
                    return 0;
                }
                for(let i = 0; i < a.hand.length; i++) {
                    if(a.hand[i] !== b.hand[i]) {
                        if(map[a.hand[i]] < map[b.hand[i]]) {
                            return -1
                        } else {
                            return 1
                        }
                    }
                }
            });
        }
    })
}

const part1 = (isPart2 = false) => {
    const handsAndBids = buildHandAndBids(isPart2);
    const groupedByHandType = groupBytype(handsAndBids);
    console.log(groupedByHandType)
    sorted(groupedByHandType, isPart2);
    let sum = 0;
    let currRank = 1;
    debugType.reverse().forEach((type) => {
        let arr = groupedByHandType[type];
        if(arr) {
            arr.forEach((handAndBid) => {
                sum = (handAndBid.bid * currRank) +sum;
                currRank += 1;
            })
        }
    })
    
    return sum;
};

// part 2 is the same as part 1 except we have to change the the get type function
const part2 = () => {
    return part1(true)
};

