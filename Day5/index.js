const fs = require('fs')

const file = process?.argv[2] === '-t' ? 'testinput.txt' : 'input.txt'

fs.readFile(file, 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const arrayOfInputs = data.split("\n")
  // const ans = partOneFast(arrayOfInputs);
  // const ans = partTwo(arrayOfInputs);
  console.log(partTwoBackwards(arrayOfInputs));
  // console.log(ans);
});

const getSeedNums = (seedNumRow) => {
  return seedNumRow.split(":")[1].trim().split(' ').map((str) => Number(str));
}

// Build Map take up too much ram. Lets think of a diff approach...
const buildMap = (input, mapKey) => {
  console.log(mapKey)
  let map = {};
  let rowIdx = input.indexOf(mapKey) + 1;
  while(input[rowIdx] && input[rowIdx] != "") {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = input[rowIdx].split(' ').map((str) => Number(str));

    for(let i = 0; i < rangeLength; i++) {
      map[sourceRangeStart + i] = destinationRangeStart + i;
    }
    rowIdx++;
  }
  return map;
}
// Build Map take up too much ram. Lets think of a diff approach...
const partOne = (input) => {
  const seedNums = getSeedNums(input[0]);

  const seedToSoilMap = buildMap(input, "seed-to-soil map:");
  const soilToFertilizerMap = buildMap(input, "soil-to-fertilizer map:");
  const fertilizerToWaterMap = buildMap(input, 'fertilizer-to-water map:');
  const waterToLightMap = buildMap(input, 'water-to-light map:');
  const lightToTemperatureMap = buildMap(input, 'light-to-temperature map:');
  const temperatureToHumidityMap = buildMap(input, 'temperature-to-humidity map:');
  const humidityToLocationMap = buildMap(input, 'humidity-to-location map:');

  const seedToLocationMap = {};
  seedNums.forEach((seedNum) => {
    const soilNum = seedToSoilMap[seedNum] ?? seedNum;
    const fertNum = soilToFertilizerMap[soilNum] ?? soilNum;
    const waterNum = fertilizerToWaterMap[fertNum] ?? soilNum;
    const lightNum = waterToLightMap[waterNum] ?? waterNum;
    const tempNum = lightToTemperatureMap[lightNum] ?? lightNum;
    const humidityNum = temperatureToHumidityMap[tempNum] ?? tempNum;
    const locationNum = humidityToLocationMap[humidityNum] ?? humidityNum;

    seedToLocationMap[seedNum] = locationNum
  });
  console.log(seedToLocationMap);
  return Object.values(seedToLocationMap).sort()[0]
};

const getValue = (input, mapKey, inputNumber) => {
  let rowIdx = input.indexOf(mapKey) + 1;
  while(input[rowIdx] && input[rowIdx] != "") {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = input[rowIdx].split(' ').map((str) => Number(str));
    const sourceRangeEnd = sourceRangeStart + rangeLength;
    console.log({sourceRangeEnd, sourceRangeStart, destinationRangeStart, inputNumber})
    if (inputNumber >= sourceRangeStart && inputNumber <= sourceRangeEnd) {
      return (inputNumber - sourceRangeStart) + destinationRangeStart;
    }
    rowIdx++;
  }
  return null;
}

const getSeedLocation = (input, seedNum) => {
  const soilNum = getValue(input, "seed-to-soil map:", seedNum) ?? seedNum;

  const fertNum =  getValue(input, "soil-to-fertilizer map:", soilNum) ?? soilNum;
  const waterNum =  getValue(input, 'fertilizer-to-water map:', fertNum) ?? fertNum;
  const lightNum =  getValue(input, 'water-to-light map:', waterNum) ?? waterNum;
  const tempNum =  getValue(input, 'light-to-temperature map:', lightNum) ?? lightNum;
  const humidityNum =  getValue(input, 'temperature-to-humidity map:', tempNum) ?? tempNum;
  return getValue(input, 'humidity-to-location map:', humidityNum) ?? humidityNum;

}

const partOneFast = (input) => {
  const seedNums = getSeedNums(input[0]);

  const seedToLocationMap = {};

  seedNums.forEach((seedNum) => {
    seedToLocationMap[seedNum] = getSeedLocation(input, seedNum);
  });
  console.log(seedToLocationMap);
  return Object.values(seedToLocationMap).sort()[0]
};

const getRangesOfSeedNums = (seedNumsRow) => {
  const arr = [];
  const nums = seedNumsRow.split(":")[1].trim().split(' ').map((str) => Number(str));
  for(let i = 0; i < nums.length; i += 2) { 
    arr.push([nums[i], nums[i] + nums[i + 1] - 1]);
  }
  return arr;
}

const getRanges = (input, mapKey, inputRanges) => {
  const newRanges = [];
  let rowIdx = input.indexOf(mapKey) + 1;
  while(input[rowIdx] && input[rowIdx] != "") {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = input[rowIdx].split(' ').map((str) => Number(str));
    const sourceRangeEnd = rangeLength + sourceRangeStart - 1;

    inputRanges.forEach((inputRange) => {
      let newRange = []
      if(inputRange[0] >= sourceRangeStart && inputRange[0] <= sourceRangeEnd) {
        newRange.push((inputRange[0] - sourceRangeStart) + destinationRangeStart);
      }
      if (inputRange[1] <= sourceRangeEnd) {
        newRange.push((inputRange[1] - sourceRangeStart) + destinationRangeStart);
      } else {
        // take care of this case presumably add it to inputRanges?
      }
      newRanges.push(newRange);
    })
    rowIdx++;
  }

  return newRanges;

}

const partTwo = (input) => {
  const seedNumRanges = getRangesOfSeedNums(input[0]);
  console.log(seedNumRanges);
  const soilRanges = getRanges(input, "seed-to-soil map:", seedNumRanges);

  const fertRanges =  getRanges(input, "soil-to-fertilizer map:", soilRanges);
  const waterRanges =  getRanges(input, 'fertilizer-to-water map:', fertRanges);
  const lightRanges =  getRanges(input, 'water-to-light map:', waterRanges);
  const tempRanges =  getRanges(input, 'light-to-temperature map:', lightRanges);
  const humidityRanges =  getRanges(input, 'temperature-to-humidity map:', tempRanges);
  const locationRanges = getRanges(input, 'humidity-to-location map:', humidityRanges);

  console.log(locationRanges);
};

const mapKeys = [
  "seed-to-soil map:",
  "soil-to-fertilizer map:",
  'fertilizer-to-water map:',
  'water-to-light map:',
  "light-to-temperature map:",
  'temperature-to-humidity map:', 
  'humidity-to-location map:'
];

let almanac = {};

const buildAlmanac = () => {
  mapKeys.forEach((mapKey) => {
    let rowIdx = input.indexOf(mapKey) + 1;
    while(input[rowIdx] && input[rowIdx] != "") {
      almanac[mapKey] = [destination, source, length];
    }
  });
}

const getSeedFromLocation = (input, locationNum) => {
  let curr = locationNum;
  mapKeys.toReversed().forEach((mapKey) => {
    let rowIdx = input.indexOf(mapKey) + 1;
    let found = false;
    while(input[rowIdx] && input[rowIdx] != "" && found === false) {
      const [destination, source, length] = input[rowIdx].split(' ').map((str) => Number(str));
      if (destination <= curr && destination + length > curr) {
        curr = source + curr - destination;
        found = true;
      }
      rowIdx++;
    }
    found = false;
  })
  return curr;
}

const seedNumExistsInRanges = (seedNumRanges, seedNum) => {
  for(let i = 0; i < seedNumRanges.length; i++) {
    if(seedNum >= seedNumRanges[i][0] && seedNum <= seedNumRanges[i][1]) {
      return true;
    }
  }
  return false;
}


const partTwoBackwards = (input) => {
  const seedNumRanges = getRangesOfSeedNums(input[0]);
  let passes = 0;
  for(let i = 1; i < 1_000_000_000; i++) {
    if(i % 10_000 === 0){
      console.log('debugging...', passes)
      passes++;
    }
    const seedNum = getSeedFromLocation(input, i);
    if(seedNumExistsInRanges(seedNumRanges, seedNum)) {
      return {seedNum, i};
    }
  }
}