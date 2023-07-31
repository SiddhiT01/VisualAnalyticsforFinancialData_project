
const dataJsonFile = process.env.DATA_FILE || '../data/results.json';

const dataJson = require(`${dataJsonFile}`);

const getAverage = (arr) => {
  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

const getMedian = (arr) => {
  const sorted = arr.sort();
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

const printStatsForSetOfParticipants = (participants) => {
  const experiments = ['scatterplot', 'timeline', 'extended'];
  const result = {};

  experiments.forEach((experiment) => {
    const avgAccuracy = getAverage(participants.map((p) => p.result[experiment].accuracy));
    const medianAccuracy = getMedian(participants.map((p) => p.result[experiment].accuracy));

    const avgTime = getAverage(participants.map((p) => {
      return (p.result[experiment].timeTaken.minutes * 60) + p.result[experiment].timeTaken.seconds;
    }));
    const medianTime = getMedian(participants.map((p) => {
      return (p.result[experiment].timeTaken.minutes * 60) + p.result[experiment].timeTaken.seconds;
    }));

    result[experiment] = {
      avgAccuracy: parseFloat(avgAccuracy.toFixed(2)),
      medianAccuracy: parseFloat(medianAccuracy.toFixed(2)),
      avgTime: parseFloat(avgTime.toFixed(2)),
      medianTime: parseFloat(medianTime.toFixed(2))
    }
  })

  console.table(result);
}

const printStatsForExperimentData = (experimentData) => {
  let correct = 0;

  experimentData.forEach((data) => {
    if (data.correct === data.prediction) {
      correct++;
    }
  });

  const accuracy = correct / experimentData.length;

  console.log(`Accuracy: ${accuracy}`);
  console.log(`Amount: ${experimentData.length}`);
}

const main = async () => {
  console.log("Starting analysis...");

  const data = dataJson.data;
  const dataKeys = Object.keys(data);

  const scatterplotFirstParticipants = [];
  const timelineFirstParticipants = [];

  const clickedChartData = [];
  const notClickedChartData = [];

  dataKeys.forEach((key) => {
    const participant = data[key];

    if (participant.scatterplotExperimentOrder[0] === 'timeline') {
      timelineFirstParticipants.push(participant);
    } else {
      scatterplotFirstParticipants.push(participant);
    }

    const participantExtendedData = participant.result.extended;
    console.log(participantExtendedData);

    Object.values(participantExtendedData.experimentData).forEach((experimentData) => {
      if (experimentData.clicked === true) {
        clickedChartData.push(experimentData);
      } else {
        notClickedChartData.push(experimentData);
      }
    });
  });

  console.log("\nScatterplot first participants:");
  printStatsForSetOfParticipants(scatterplotFirstParticipants);

  console.log("\nTimeline first participants:");
  printStatsForSetOfParticipants(timelineFirstParticipants);

  console.log("\nClicked chart data:");
  printStatsForExperimentData(clickedChartData);

  console.log("\nNot clicked chart data:");
  printStatsForExperimentData(notClickedChartData);
}

main();