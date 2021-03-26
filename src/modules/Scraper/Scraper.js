/**
 * Main scraping module
 * @module Scraper
 */

const {
  addCalculationColumns,
  filterDataRows,
} = require('../../filtersAndFixes');
const { consLog, createLogFilepath, saveToJson } = require('../shared');
const {
  URLS_TO_SCRAPE,
  SCRAPE_UNTIL_DATE,
  SCRAPE_PAGES_COUNT,
  SAVE_LOGS,
  SUMMARY_FILENAME,
  DETAILS_FILENAME,
} = require('../../Config');

const DEFINED_SCRAPERS = ['olx', 'gumtree', 'empik'];

/**
 * Includes proper functions to scrape the supplied origin parameter, gets the data, saves logs if logs enabled in config
 * @category async
 * @alias module:Scraper
 * @param {string} origin Currently accepts values: 'olx'/'gumtree'
 * @return {Promise<Array.<object>>} detailed offers data
 */
module.exports = async function Scraper(origin) {
  // check with list of allowed scrapers
  if (!DEFINED_SCRAPERS.includes(origin))
    throw new Error('Wrong scraper specified');

  const {
    MAX_PAGES,
    isTodaysOffer,
    isYesterdaysOffer,
    launchBrowser,
    getBrowserTab,
    getAvailablePagesNumber,
    setPageIndex,
    getSummaries,
    getDetails,
    enhanceSummary,
    enhanceDetails,
  } = require(`./scraping-${origin}`);

  /**
   * Checks if offer is from today or yesterday
   * @private
   * @param {object} offer
   * @return {bool}
   */
  const isTodayYesterdaysOffer = (offer) =>
    isTodaysOffer(offer) || isYesterdaysOffer(offer);

  /**
   * Always returns true
   * @private
   * @return {true}
   */
  const isTrue = () => true;

  /**
   * Checks is offer is not from today
   * @private
   * @param {object} offer
   * @return {bool}
   */
  const isNotTodaysOffer = (offer) => !isTodaysOffer(offer);

  /**
   * Checks is offer is not from today nor yesterday
   * @private
   * @param {object} offer
   * @return {bool}
   */
  const isNotTodayYesterdaysOffer = (offer) => !isTodayYesterdaysOffer(offer);

  /**
   * Checks if offers array contain only offers from today
   * @private
   * @param {Array.<object>} summaryData
   * @return {bool}
   */
  const hasOnlyTodayData = (summaryData) =>
    !summaryData.filter(isNotTodaysOffer).length;

  /**
   * Checks if offers array contain only offers from today or yesterday
   * @private
   * @param {Array.<object>} summaryData
   * @return {bool}
   */
  const hasOnlyTodayYesterdayData = (summaryData) =>
    !summaryData.filter(isNotTodayYesterdaysOffer).length;

  /**
   * Scrape stuff
   * @private
   * @param {string} scrapeAsLongAs
   * @param {number} scrapePagesCount
   * @param {number} maxResultPagesFromOrigin
   * @return {{isOfferInScope: function, isDataInScope: function, maxPages: number}}
   */
  function getScrapingLimits(
    scrapeAsLongAs,
    scrapePagesCount,
    maxResultPagesFromOrigin
  ) {
    const maxPages =
      !!scrapePagesCount || scrapePagesCount === 0
        ? scrapePagesCount
        : maxResultPagesFromOrigin;
    if (scrapeAsLongAs === 'today') {
      return [isTodaysOffer, hasOnlyTodayData, maxPages];
    }
    if (scrapeAsLongAs === 'yesterday') {
      return [isTodayYesterdaysOffer, hasOnlyTodayYesterdayData, maxPages];
    }

    return [isTrue, isTrue, maxPages];
  }
  const [isOfferInScope, isDataInScope, maxPages] = getScrapingLimits(
    SCRAPE_UNTIL_DATE,
    SCRAPE_PAGES_COUNT,
    MAX_PAGES
  );
  const SCRAPED_URLS = URLS_TO_SCRAPE[origin];
  const SUMMARY_FILEPATH = createLogFilepath(SUMMARY_FILENAME, origin);
  const DETAILS_FILEPATH = createLogFilepath(DETAILS_FILENAME, origin);

  const summariesFromAllUrls = [];
  const detailsFromAllUrls = [];

  for (const scrapedUrl of SCRAPED_URLS) {
    const browser = origin === 'olx' ? await launchBrowser() : null;
    const browserTab = origin === 'olx' ? await getBrowserTab(browser) : null;
    const pagesAvailable = await getAvailablePagesNumber(
      scrapedUrl,
      browserTab
    );

    // scrape offer summaries
    const fetchedSummaries = [];
    let pageIndex = 1;
    let pageUrl;
    do {
      pageUrl = setPageIndex(scrapedUrl, pageIndex);
      const scrapeResult = await getSummaries(pageUrl, browserTab);
      if (SAVE_LOGS)
        consLog(`Fetched ${origin} offer summaries from page=${pageIndex}`);
      fetchedSummaries.push(...scrapeResult);
      pageIndex++;
    } while (
      isDataInScope(fetchedSummaries) &&
      pageIndex <= maxPages &&
      pageIndex <= pagesAvailable
    );

    const enhancedSummaries = fetchedSummaries
      .filter(isOfferInScope)
      .map(enhanceSummary);
    summariesFromAllUrls.push(...enhancedSummaries);

    // get details for scraped offers
    const fetchedDetails = [];

    for (const summaryOffer of enhancedSummaries) {
      if (SAVE_LOGS)
        consLog(
          `Fetching details of ${origin} offer with ID:${summaryOffer.id}`
        );
      const scrapeResult = await getDetails(summaryOffer.url, browserTab);
      fetchedDetails.push({ ...summaryOffer, ...scrapeResult });
    }

    if (browser) await browser.close();

    const enhancedDetails = fetchedDetails.map(enhanceDetails);
    detailsFromAllUrls.push(...enhancedDetails);
  }

  // fix and filter data
  const allFixedSummaries = summariesFromAllUrls.filter(filterDataRows);
  const allFixedDetails = addCalculationColumns(detailsFromAllUrls).filter(
    filterDataRows
  );

  if (SAVE_LOGS) {
    saveToJson(allFixedSummaries, SUMMARY_FILEPATH);
    saveToJson(allFixedDetails, DETAILS_FILEPATH);
  }

  return allFixedDetails;
};
