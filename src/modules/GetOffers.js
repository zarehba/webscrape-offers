/**
 * Main module concerning the process flow.
 * @module GetOffers
 */

const fs = require('fs');
const Excel = require('./Excel/Excel');
const Scraper = require('./Scraper/Scraper');
const { notifyAboutNewOffers } = require('./SendMail/SendMail');
const { deleteChosenCols } = require('../filtersAndFixes');
const {
  consLog,
  tryAndDo,
  createLogFilepath,
  saveToJson,
  consError,
} = require('./shared');
const {
  SAVE_LOGS,
  SEND_MAIL,
  SAVE_TO_EXCEL,
  DATA_PATH,
  DATA_FILENAME,
  NEWOFFERS_FILENAME,
  ORIGINS_TO_SCRAPE,
} = require('../Config');

const ALLDATA_FILEPATH = ORIGINS_TO_SCRAPE.reduce(
  (filepaths, origin) => ({
    ...filepaths,
    [origin]: DATA_PATH + `${origin}-${DATA_FILENAME}`,
  }),
  {}
);
const NEWOFFERS_FILEPATH = ORIGINS_TO_SCRAPE.reduce(
  (filepaths, origin) => ({
    ...filepaths,
    [origin]: createLogFilepath(NEWOFFERS_FILENAME, origin),
  }),
  {}
);

ORIGINS_TO_SCRAPE.forEach((origin) => {
  const jsonPath = `${DATA_PATH}${origin}-${DATA_FILENAME}.json`;
  if (!fs.existsSync(jsonPath)) fs.writeFileSync(jsonPath, JSON.stringify([]));
});
const persistingOffers = ORIGINS_TO_SCRAPE.reduce(
  (offers, origin) => ({
    ...offers,
    [origin]: JSON.parse(
      fs.readFileSync(`${DATA_PATH}${origin}-${DATA_FILENAME}.json`, 'utf-8')
    ),
  }),
  {}
);
/**
 * Gets data from websites, saves data to files, sends mail notification about new offers.
 * @category async
 * @alias module:GetOffers
 * @param {string} origin scraped website (from ORIGINS_TO_SCRAPE config variable)
 */
module.exports = async function GetOffers(origin) {
  if (SAVE_LOGS) consLog(`Getting new orders from ${origin}`);

  const fetchedOffers = await tryAndDo(
    async () => Scraper(origin),
    (err) => {
      if (SAVE_LOGS)
        consError(
          `There was an error fetching new offers from ${origin}:\n${err}`
        );
      throw new Error(err);
    }
  );

  const newIds = getNewIds(persistingOffers[origin], fetchedOffers);
  const isNewOffer = (offer) => newIds.has(offer.id);
  const newOffers = fetchedOffers.filter(isNewOffer);
  // const newOffers = newO;
  const allOffers = [...persistingOffers[origin], ...newOffers];

  if (newOffers.length) {
    await handleNewOffers(newOffers, allOffers, origin);
  }
  if (SAVE_LOGS)
    consLog(`There were ${newOffers.length} new orders from ${origin}`);
  if (SAVE_LOGS) consLog(`Finished getting orders from ${origin}`);
};

/**
 * @param {Array<object>} offers offer details
 * @return {Set<string>} unique offer ids
 */
const getSetOfIds = (offers) => new Set(offers.map((offer) => offer.id));
/**
 * Gets new ids, i.e. ids which are only present in argument supplied as 2nd one
 * @param {Array<object>} oldOffers
 * @param {Array<object>} newOffers
 * @return {Set<string>} new unique offer ids
 */
const getNewIds = (oldOffers, newOffers) => {
  const oldSet = getSetOfIds(oldOffers);
  const newSet = getSetOfIds(newOffers);
  return new Set([...newSet].filter((id) => !oldSet.has(id)));
};

/**
 * Function executed if new offers were scraped.\
 * Saves data to file/s and sends mail notification about new offers.
 * @param {Array<object>} newOffers
 * @param {Array<object>} allOffers
 * @param {string} origin scraped website (from ORIGINS_TO_SCRAPE config variable)
 */
async function handleNewOffers(newOffers, allOffers, origin) {
  // log new offers
  if (SAVE_LOGS) saveToJson(newOffers, NEWOFFERS_FILEPATH[origin]);
  // save all offers as new json database
  saveToJson(allOffers, ALLDATA_FILEPATH[origin]);
  // append new offers to excel
  if (SAVE_TO_EXCEL) {
    await Excel(
      newOffers.map(deleteChosenCols),
      `${ALLDATA_FILEPATH[origin]}.xlsx`,
      origin
    );
  }
  // send mail notification about new offers
  if (SEND_MAIL) {
    const vars = {
      newOffersCount: newOffers.length,
      origin: origin,
    };
    notifyAboutNewOffers(vars);
  }
  // add new offers to variable (in case app is running at time intervals)
  persistingOffers[origin].push(...newOffers);
}
