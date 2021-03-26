/**
 * Module with functions shared by all specific website scraping modules
 * @module scrapingShared
 */

const fetch = require('node-fetch');
const { consLog } = require('../shared');
const {
  SAVE_LOGS,
  API_TIMEOUT_SECONDS,
  API_MAX_FETCH_ATTEMPTS,
} = require('../../Config');

/**
 * Fetches request html from supplied url
 * @category async
 * @alias module:scrapingShared
 * @param {string} pageUrl url to GET
 * @return {Promise<string>} request body
 */
const fetchPage = async function (pageUrl) {
  try {
    if (SAVE_LOGS) console.time('Page fetched in');
    const { data } = await fetchReq({ url: pageUrl });
    if (SAVE_LOGS) console.timeEnd('Page fetched in');
    return data;
  } catch (err) {
    if (SAVE_LOGS) console.timeEnd('Page fetched in');
    throw new Error(err);
  }
};

/**
 * Timeout promise which wins the Promise.race against longer running fetch calls
 * @public
 * @category async
 * @param {number} s timeout in seconds
 * @return {Promise<void>}
 */
const fetchTimeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request timed out after ${s} seconds`));
    }, s * 1000);
  });
};

/**
 * Perform GET fetch and time out long-running request.
 * This function uses recursion to perform a limited number of fetch attempts in case of empty response.
 * (for some reason gumtree seems to occasionally return an empty response for a valid request).
 * @category async
 * @param {Object} obj
 * @param {string} obj.url - used in recursive calls
 * @param {number} obj.fetchAttemptCnt - used in recursive calls
 * @return {Promise<{url: string, fetchAttemptCnt: number, data: string}>}
 */
const fetchReq = async function ({ url, fetchAttemptCnt }) {
  const res = await Promise.race([
    fetch(encodeURI(url)),
    fetchTimeout(API_TIMEOUT_SECONDS),
  ]);
  let data = await res.text();

  if (!res.ok) throw new Error(`${data.message} (${res.status})`);

  if (fetchAttemptCnt >= API_MAX_FETCH_ATTEMPTS)
    throw new Error(`Request body was empty.`);
  if (!data) {
    if (SAVE_LOGS) consLog('Retry fetching');
    ({ data } = await fetchReq({
      url: url,
      // treat first run as fetchAttemptCnt = 1
      fetchAttemptCnt: fetchAttemptCnt ? fetchAttemptCnt + 1 : 2,
    }));
  }

  return { url: url, fetchAttemptCnt: fetchAttemptCnt, data: data };
};

/**
 * @alias module:scrapingShared
 * @param {Date} date
 * @returns {string} date like 'YYYY-MM-DD'
 */
const toIsoDate = (date) => date.toISOString().substr(0, 10);

/**
 * @alias module:scrapingShared
 * @param {string} rawPrice price string like ' 50.21 zł '
 * @returns {number} price number like 50.21
 */
function rawPriceToNumber(rawPrice) {
  if (!rawPrice && rawPrice !== '0') return null;
  const priceStr = rawPrice
    .replace('zł', '')
    .replace(/[zł\/m²]/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');
  return Math.round(+priceStr);
}

/**
 * Converts string to number. If nullish value is supplied, return null.
 * @alias module:scrapingShared
 * @param {string|null} str
 * @returns {number|null}
 */
function castToNumber(str) {
  if (!str && str !== '0') return null;
  return +str;
}

module.exports = {
  fetchPage,
  toIsoDate,
  rawPriceToNumber,
  castToNumber,
};
