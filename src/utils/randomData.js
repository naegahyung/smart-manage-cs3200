import moment from 'moment'

function momentRandom(end = moment(), start) {
  const endTime = +moment(end);
  const randomNumber = (to, from = 0) =>
    Math.floor(Math.random() * (to - from) + from);

  if (start) {
    const startTime = +moment(start);
    if (startTime > endTime) {
      throw new Error('End date is before start date!');
    }
    return moment(randomNumber(endTime, startTime));
  }
  return moment(randomNumber(endTime));
}

export default function generateDumbData(count, timestamp) {
  const dummy = {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    meta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  }
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({ 
      ...dummy, 
      timestamp: timestamp || momentRandom(),
      index: i,
    });
  }
  return data;
}
