const finnhub = require("finnhub");
const fs = require('fs');
const util = require('util');

/**
 * This file is not used in the app, it's just a helper to generate
 * consistent data for the charts.
 *
 * Random symbols have been picked from the S&P 500. This
 * data is not included in the repo, therefore `getRandomCompanySymbols`
 * will not work unless you include a `symbols.json` file in the `src/data`.
 *
 * Run this file with `FINNHUB_KEY=XYZ123 node dataGenerator.js` to generate the data.
 */

finnhub.ApiClient.instance.authentications["api_key"].apiKey = process.env.FINNHUB_KEY;
const finnhubClient = new finnhub.DefaultApi();

const definitionFile = process.env.DEF_FILE || 'defined.json';
const outputFile = process.env.OUTPUT_FILE || 'experimentData.json';

const definedDataJson = require(`../data/${definitionFile}`);

const COMPANIES = [
  'AME', 'OTIS', 'TXN', 'AMGN', 'ACN', 'CMCSA',
  'CHRW', 'CSCO', 'ITW', 'NWSA', 'MGM', 'WRB',
  'O', 'PRU', 'TSN', 'MCHP', 'DE', 'VTR',
  'AMCR', 'NOW', 'IVZ', 'SO', 'MO', 'ABBV',
  'TAP', 'AAP', 'J', 'LUV', 'CI', 'XEL',
  'ADM', 'CBOE', 'AIG', 'AEE', 'LVS', 'QRVO',
  'GOOGL', 'UPS', 'COST', 'LKQ', 'ETSY', 'CMA',
  'TDY', 'AMP', 'CPB', 'ETR', 'URI', 'ORLY',
  'MU', 'WLTW', 'MSCI', 'PH', 'AZO', 'LDOS',
  'MRO', 'ATVI', 'KR', 'EW', 'FLT', 'FOX'
]

const INDICATORS = {
  one: {
    name: "sma",
    resolution: 25,
  },
  two: {
    name: "sma",
    resolution: 125,
  }
}

const TREND_PERCENT_DEFINITION = 5;

const zipFromWhereBothNotZero = (arr1, arr2) => {
  const zipped = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== 0 && arr2[i] !== 0) {
      zipped.push([arr1[i], arr2[i]]);
    }
  }
  return zipped;
}

const arrayToFixedDecimal = (arr, decimal) => {
  return arr.map((val) => {
    return parseFloat(val.toFixed(decimal));
  });
}

// WARNING: Will not work by default, see comment at top of file.
const getRandomCompanySymbols = (n) => {
  fs.readFile("src/data/symbols.json", (err, data) => {
    if (err) throw err;

    const jsonArray = JSON.parse(data);
    const symbols = jsonArray.map(obj => obj["Symbol"]);

    const randomSymbols = [];
    while (randomSymbols.length < n) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      if (!randomSymbols.includes(randomSymbol)) {
        randomSymbols.push(randomSymbol);
      }
    }

    console.log(randomSymbols);
  });
}

const getTechnicalIndicator = async (symbol, resolution, from, to, indicator, indicatorFields) => {
  return new Promise((resolve, reject) => {
    finnhubClient.technicalIndicator(
      symbol,
      resolution,
      from,
      to,
      indicator,
      {indicatorFields},
      (e, data, res) => {
        if (e) {
          reject(e);
        } else {
          resolve(data);
        }
      }
    );
  });
}

const calculateTrend = (data) => {
  const first = data[0];
  const last = data[data.length - 1];
  const diff = last - first;
  const percentDiff = diff / first * 100;

  let trend;
  if (percentDiff > TREND_PERCENT_DEFINITION) {
    trend = "up";
  } else if (percentDiff < -TREND_PERCENT_DEFINITION) {
    trend = "down";
  } else {
    trend = "notrend";
  }

  return {percentDiff, trend};
}

const generateCompositeData = async (companyInfos) => {
  if (companyInfos.length < 20)
    console.warn("\x1b[33m%s\x1b[0m", "\nWARNING: Less than 20 companies supplied!\n");

  const dataResult = [];
  let idCounter = 0;

  for (let i = 0; i < companyInfos.length; i++) {
    const company = companyInfos[i];

    // Finnhub has rate limit of 30 requests per second
    await new Promise(r => setTimeout(r, 75));

    const bufferDays = (INDICATORS.two.resolution * 7) / 5;
    const bufferWorkingDays = bufferDays * 5 / 7;
    const bufferUnixTime = 86400 * bufferDays;

    const fromUnix = (new Date(company.from) / 1000) - bufferUnixTime;
    const untilUnix = new Date(company.until) / 1000;

    let data = await getTechnicalIndicator(
      company.symbol,
      "D",
      fromUnix,
      untilUnix,
      INDICATORS.one.name,
      {timeperiod: INDICATORS.one.resolution}
    );
    data = {
      ...data,
      t: data.t.slice(bufferWorkingDays),
      sma: data.sma.slice(bufferWorkingDays),
      c: data.c.slice(bufferWorkingDays),
    }

    let data2 = await getTechnicalIndicator(
      company.symbol,
      "D",
      fromUnix,
      untilUnix,
      INDICATORS.two.name,
      {timeperiod: INDICATORS.two.resolution}
    );
    data2 = {
      ...data2,
      t: data2.t.slice(bufferWorkingDays),
      sma: data2.sma.slice(bufferWorkingDays),
      c: data2.c.slice(bufferWorkingDays),
    }

    const zippedScatterData = zipFromWhereBothNotZero(
      arrayToFixedDecimal(data.sma, 2),
      arrayToFixedDecimal(data2.sma, 2)
    );

    const priceData = zipFromWhereBothNotZero(
      arrayToFixedDecimal(data.c, 2),
      data.t.map((unix) => new Date(unix * 1000).toISOString().slice(0, 10))
    );

    const indicatorOneData = zipFromWhereBothNotZero(
      arrayToFixedDecimal(data.sma, 2),
      data.t.map((unix) => new Date(unix * 1000).toISOString().slice(0, 10))
    );

    const indicatorTwoData = zipFromWhereBothNotZero(
      arrayToFixedDecimal(data2.sma, 2),
      data.t.map((unix) => new Date(unix * 1000).toISOString().slice(0, 10))
    );

    const {percentDiff: trendPercentDiff, trend: calculatedTrend} = calculateTrend(data.c);
    if (calculatedTrend === "up" && company.answer === "down" || calculatedTrend === "down" && company.answer === "up")
      console.warn("\x1b[33m%s\x1b[0m", `WARNING: ${company.symbol} (${i}) calculated as "${calculatedTrend}" but set as "${company.answer}"!`);

    dataResult.push({
      symbol: company.symbol,
      id: idCounter++,
      from: fromUnix,
      until: untilUnix,
      trendPercentDiff,
      trend: company.answer,
      data: {
        scatterplot: zippedScatterData,
        price: priceData,
        indicatorOne: indicatorOneData,
        indicatorTwo: indicatorTwoData,
      },
    });

    console.log(`Fetched for ${company.symbol} (${i})..${zippedScatterData.length} scatter points..${data.c.length} price points\n`);
  }

  const upTrendAmount = dataResult.filter(company => company.trend === "up").length;
  const downTrendAmount = dataResult.filter(company => company.trend === "down").length;
  const noTrendAmount = dataResult.filter(company => company.trend === "notrend").length;

  const result = {
    trendDefinition: TREND_PERCENT_DEFINITION,
    axis: {
      scatterplot: {
        x: {
          name: INDICATORS.one.name,
          resolution: INDICATORS.one.resolution,
        },
        y: {
          name: INDICATORS.two.name,
          resolution: INDICATORS.two.resolution,
        }
      }
    },
    upTrendAmount,
    downTrendAmount,
    noTrendAmount,
    dataAmount: dataResult.length,
    data: dataResult,
  }

  fs.writeFile(`src/data/${outputFile}`, JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log(`
      Data generated for ${result.data.length} companies
      Up trend: ${upTrendAmount}
      Down trend: ${downTrendAmount}
      No trend: ${noTrendAmount}
    `)
  });
}

const generateData = async () => {
  console.log("\nGenerating data...");

  console.log(`Scatterplots will feature ${INDICATORS.one.name}(${INDICATORS.one.resolution}) against ${INDICATORS.two.name}(${INDICATORS.two.resolution})`);

  await generateCompositeData(definedDataJson);
}

generateData();

// See top of file
// getRandomCompanySymbols(60);