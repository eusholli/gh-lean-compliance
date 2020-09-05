/*
Utility to generate initial checklist-data.json file
generate input file with following command
grep -E "(### | \|)" *.md > rawdata.txt  

run: node parseraw
*/

const util = require('util');
const fs = require('fs');

let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./rawdata.txt'),
});

let principle;
let data = {};
lineReader.on('line', function (line) {
  const bits = line.split(/\./);
  const stage = bits[0];
  console.log(`stage "${stage}"`);

  if (line.indexOf('###') !== -1) {
    principle = line.replace(/.*### /, '').trim();
    if (principle === 'Proactive not Reactive/Preventative not Remedial')
      principle = 'Proactive not Reactive';
    console.log(`principle "${principle}"`);
  } else if (
    line.indexOf('|') !== -1 &&
    line.indexOf('---') === -1 &&
    line.indexOf('Description') === -1
  ) {
    const bits = line.split(/\|/);
    const slogan = bits[2].trim();
    console.log(`slogan "${slogan}"`);
    if (data[stage] === undefined) {
      data[stage] = [];
    }
    if (slogan !== '-' && slogan !== '') {
      data[stage].push({
        slogan,
        when: 'when',
        principles: [principle],
      });
      console.log('slogan added: ' + util.inspect(data, { depth: 5 }));
    }
  }
  // console.log(line);
});

lineReader.on('close', () => {
  console.log('end');
  fs.writeFileSync('checklist-data.json', JSON.stringify(data));
});
// fs.writeFileSync('checklist-data.json', JSON.stringify(data));
