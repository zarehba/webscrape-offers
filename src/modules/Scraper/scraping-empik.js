/**
 * Module used for scraping empik.pl ebooks i audiobooks.
 * Utilizing jsdom library to parse fetched HTML
 * @module scraping-empik
 */

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { consLog, consError, tryAndDo } = require('../shared');
const { fetchPage } = require(`./scrapingShared`);
const { SAVE_LOGS } = require('../../Config');

/**
 * Looks like Empik does not have any result page number limit
 * @alias module:scraping-empik
 */
const MAX_PAGES = 999999;

/**
 * Returns search result page index from supplied url string
 * @category async
 * @alias module:scraping-empik
 * @param {string} scrapedUrl
 * @return {Promise<number>} last page index
 */
async function getAvailablePagesNumber(scrapedUrl) {
  const firstPageHtml = await fetchPage(scrapedUrl);
  const { document } = new JSDOM(firstPageHtml).window;
  const lastPageIndex = parseInt(
    document.querySelector('.pagination > a:not([class])').textContent
  );
  return lastPageIndex;
}

/**
 * Returns search result page url string from supplied page index
 * @alias module:scraping-empik
 * @param {string} pageUrl - base url string
 * @param {number|string} pageIndex - url parameter
 * @return {string}
 */
function setPageIndex(pageUrl, pageIndex) {
  const newUrlPageParam = empikCalculateNewUrlPageParam(pageUrl, pageIndex);
  const url = pageUrl.replace('${pageParam}', newUrlPageParam);
  return url;
}

/**
 * Checks if gumtree offer was added yesterday
 * @alias module:scraping-empik
 * @param {object} offer - offer
 * @return {true}
 */
const isYesterdaysOffer = (offer) => true;

/**
 * Checks if gumtree offer was added today
 * @alias module:scraping-empik
 * @param {object} offer - offer
 * @return {true}
 */
const isTodaysOffer = (offer) => true;

/**
 * Fetch and scrape a page with offer summaries
 * @category async
 * @alias module:scraping-empik
 * @param {string} pageUrl - offer summaries page url
 * @return {Promise<Array.<object>>} offer summaries
 */
async function getSummaries(pageUrl) {
  const pageHtml = await fetchPage(pageUrl);
  const fetchedSummaries = scrapeSummaries(pageHtml);
  return fetchedSummaries;
}

/**
 * Scrape offer summaries from a page html text
 * @param {string} pageHtml
 * @return {Array.<object>} offer summaries
 */
function scrapeSummaries(pageHtml) {
  const { document } = new JSDOM(pageHtml).window;
  const summaryTiles = [...document.querySelectorAll('.search-list-item')];

  const summaries = summaryTiles.map((summ) => ({
    id: summ.querySelector('.product-details-wrapper').dataset.productId,
    title: summ.querySelector('.ta-product-title')
      ? summ.querySelector('.ta-product-title').textContent
      : '',
    author: summ.querySelector('.smartAuthor')
      ? summ.querySelector('.smartAuthor').textContent
      : '',
    url: summ.querySelector('.productWrapper > a')
      ? summ.querySelector('.productWrapper > a').href
      : '',
    price: summ.querySelector('.price')
      ? summ.querySelector('.price').textContent
      : '',
    thumbnail: summ.querySelector('img.lazy')
      ? summ.querySelector('img.lazy').getAttribute('lazy-img')
      : '',
  }));

  return summaries;
}

/**
 * Fix and add fields to fetched offer summary data
 * @alias module:scraping-empik
 * @param {object} summary - one offer summary
 * @return {object} enhanced summary
 */
function enhanceSummary(summary) {
  return {
    ...summary,
    url: generateAbsoluteUrl(summary.url),
  };
}

/**
 * Fetch and scrape a page with offer details
 * @category async
 * @alias module:scraping-empik
 * @param {string} pageUrl - offer details page url
 * @return {Promise<object>} offer details
 */
async function getDetails(pageUrl) {
  if (SAVE_LOGS) consLog(`Scraping details of: ${pageUrl}`);
  const fetchedDetails = await tryAndDo(
    async () => fetchPage(pageUrl).then((pageHtml) => scrapeDetails(pageHtml)),
    (err) => {
      if (SAVE_LOGS)
        consError(`There was an error fetching order from ${pageUrl}:\n`, err);
    }
  );
  return fetchedDetails;
}

/**
 * Scrape offer details from a page html text
 * @param {string} pageHtml
 * @return {object|null} offer details
 */
function scrapeDetails(pageHtml) {
  if (!pageHtml) return null;
  const { document } = new JSDOM(pageHtml).window;

  const breadcrumbs = [...document.querySelectorAll('.ta-breadcrumb')];
  const categories = [];
  if (breadcrumbs)
    categories.push(...breadcrumbs.map((brdcrmb) => brdcrmb.textContent));

  const details = {
    categories: categories,
    description: document.querySelector('.productDescription').textContent,
    isInEmpikGoSubscription: document.querySelector(
      '.sellerNav__subscription > [title="EmpikGO"]'
    )
      ? true
      : false,
  };

  return details;
}

/**
 * Fix and add fields to fetched offer details data\
 * Maps field categories like ['cat0', 'cat1'] into separate object fields like: cat.lev0: 'cat0'
 * @alias module:scraping-empik
 * @param {object} offer - one offer details
 * @return {object} enhanced details
 */
function enhanceDetails(offer) {
  if (!offer || !offer.categories) {
    consLog(`Brak szczegółów (kategorii) dla id:\t${offer.id}`);
    return offer;
  }
  return {
    ...offer,
    ...offer.categories.reduce((categoryLvlsObj, name, index) => {
      const fullNewName = offer.categories.reduce(
        (fullPrefix, prefixName, prefixIndex) => {
          if (prefixIndex === 0) return prefixName.trim();
          if (prefixIndex <= index)
            return fullPrefix + ' > ' + prefixName.trim();
          return fullPrefix;
        },
        ''
      );
      return { ...categoryLvlsObj, [`category.lev${index}`]: fullNewName };
    }, {}),
  };
}

/**
 * @param {string} urlStr - empik's offer absolute url
 * @param {number} pageIndex - empik's offer absolute url
 * @return {number} new url page param = results per page * new page index + 1
 */
function empikCalculateNewUrlPageParam(urlStr, pageIndex) {
  const resultsPerPage = parseInt(
    new URLSearchParams(new URL(urlStr).search.substring(1)).get('resultsPP')
  );
  const newUrlPageParam = (pageIndex - 1) * resultsPerPage + 1;
  return newUrlPageParam;
}

/**
 * @param {string} relativeUrl - empik's product item relative url
 * @return {string|''}} empik's product item absolute url string
 */
function generateAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return '';
  return `https://www.empik.com${relativeUrl}`;
}

module.exports = {
  MAX_PAGES,
  getAvailablePagesNumber,
  setPageIndex,
  isTodaysOffer,
  isYesterdaysOffer,
  getSummaries,
  getDetails,
  enhanceSummary,
  enhanceDetails,
};
