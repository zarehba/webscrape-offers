/**
 * App index file.
 * Starts the process of scraping data,
 * runs scraping at time intervals if this option is turned on in config.js,
 * send mail notification about process error if that option is turned on in config.js
 * @module App
 */

const dotenv = require('dotenv');
dotenv.config();
const GetOffers = require('./modules/GetOffers');
const { consLog, tryAndDo } = require('./modules/shared');
const { notifyAboutError } = require('./modules/SendMail/SendMail');
const {
  SAVE_LOGS,
  ORIGINS_TO_SCRAPE,
  RUN_INTERVALS,
  REFRESH_TIME,
} = require('./Config');

if (SAVE_LOGS) consLog(`App is running. Scraping ${ORIGINS_TO_SCRAPE}.`);

ORIGINS_TO_SCRAPE.forEach((origin) => {
  tryAndDo(
    async () => GetOffers(origin),
    (err) => notifyAboutError(err)
  );

  // scrape new orders at intervals
  if (RUN_INTERVALS) {
    if (SAVE_LOGS)
      consLog(`New orders are scraped every ${REFRESH_TIME / 60000} MINUTES`);

    setInterval(
      async () =>
        tryAndDo(
          () => GetOffers(origin),
          (err) => notifyAboutError(err)
        ),
      REFRESH_TIME
    );
  }
});
