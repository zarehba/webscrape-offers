/**
 * Module scraping gumtree.pl offers.
 * Utilizing jsdom library to parse fetched HTML
 * @module scraping-gumtree
 */

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { consLog, consError, tryAndDo } = require('../shared');
const {
  fetchPage,
  toIsoDate,
  rawPriceToNumber,
  castToNumber,
} = require(`./scrapingShared`);
const { SAVE_LOGS } = require('../../Config');
/**
 * Gumtree currently returns 50 result pages at maximum
 * @alias module:scraping-gumtree
 */
const MAX_PAGES = 50;

/**
 * Returns search result page index from supplied relative url string
 * @category async
 * @alias module:scraping-gumtree
 * @param {string} scrapedUrl
 * @return {Promise<number>} last page index
 */
async function getAvailablePagesNumber(scrapedUrl) {
  const firstPageHtml = await fetchPage(scrapedUrl);
  const { document } = new JSDOM(firstPageHtml).window;
  const lastPageUrl = document.querySelector('.pag-box-last').href;
  const lastPageAbsUrl = recreateAbsoluteUrl(scrapedUrl, lastPageUrl);
  return gumtreeGetPageIndexFromUrl(lastPageAbsUrl);
}

/**
 * Returns search result page url string from supplied page index
 * @alias module:scraping-gumtree
 * @param {string} pageUrl - base url string
 * @param {number|string} pageIndex - url parameter
 * @return {string}
 */
function setPageIndex(pageUrl, pageIndex) {
  const url = new URL(pageUrl);
  const basePathnameEnd = url.pathname.lastIndexOf('p') + 1;
  const basePathname = url.pathname.substr(0, basePathnameEnd);
  url.pathname = basePathname + pageIndex;
  return url.toString();
}

/**
 * Checks if gumtree offer was added yesterday
 * @alias module:scraping-gumtree
 * @param {object} offer - offer
 * @return {boolean}
 */
const isYesterdaysOffer = (offer) =>
  offer.rawDatetime.trim() === '1 dzień temu';

/**
 * Checks if gumtree offer was added today
 * @alias module:scraping-gumtree
 * @param {object} offer - offer
 * @return {boolean}
 */
const isTodaysOffer = (offer) =>
  offer.rawDatetime.includes('godzin') || offer.rawDatetime.includes('minut');

/**
 * Fetch and scrape a page with offer summaries
 * @category async
 * @alias module:scraping-gumtree
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
  const summaryTiles = [
    ...document.querySelectorAll('.view > div:not(.banner-css)'),
  ];

  const summaries = summaryTiles.map((summ) => ({
    id: summ.querySelector('.addAdTofav').dataset.shortId,
    rawAdId: summ.querySelector('.addAdTofav').dataset.adid,
    title: summ.querySelector('.title').textContent,
    url: summ.querySelector('.title > a').href,
    thumbnail: summ.querySelector('.tile-img-section [type="image/jpeg"]')
      ? summ.querySelector('.tile-img-section [type="image/jpeg"]').dataset
          .srcset
      : '',
    rawDatetime: summ.querySelector('.creation-date').textContent,
    rawLocation: summ.querySelector('.category-location').textContent,
    rawPrice: summ.querySelector('.ad-price').textContent,
  }));

  return summaries;
}

/**
 * Fix and add fields to fetched offer summary data
 * @alias module:scraping-gumtree
 * @param {object} summary - one offer summary
 * @return {object} enhanced summary
 */
function enhanceSummary(summary) {
  return {
    ...summary,
    url: generateAbsoluteUrl(summary.url),
    district: rawLocationToDistrict(summary.rawLocation),
    city: rawLocationToCity(summary.rawLocation),
    price: rawPriceToNumber(summary.rawPrice),
    date: rawDatetimeToDate(summary.rawDatetime),
    time: rawDatetimeToTime(summary.rawDatetime),
  };
}

/**
 * Fetch and scrape a page with offer details
 * @category async
 * @alias module:scraping-gumtree
 * @param {string} pageUrl - offer details page url
 * @return {Promise<object>} offer details
 */
async function getDetails(pageUrl) {
  if (SAVE_LOGS) consLog(`Scraping details of: ${pageUrl}`);
  const fetchedDetails = await tryAndDo(
    async () =>
      fetchPage(pageUrl).then(
        async (pageHtml) => await scrapeDetails(pageHtml)
      ),
    (err) => {
      if (SAVE_LOGS)
        consError(`There was an error fetching order from ${pageUrl}:\n${err}`);
    }
  );
  return fetchedDetails;
}

/**
 * Scrape offer details from a page html text
 * @category async
 * @param {string} pageHtml
 * @return {Promise<object|null>} offer details
 */
async function scrapeDetails(pageHtml) {
  if (!pageHtml) return null;
  const { document } = new JSDOM(pageHtml).window;

  const detailFieldsContainer = document.querySelector('.selMenu');
  const fieldsDetails = await fieldsFromPanel(detailFieldsContainer);

  const details = {
    ...fieldsDetails,
    description: document.querySelector('.description').textContent,
    sellerName: document.querySelector('.username > a').childNodes[0].nodeValue,
    sellerContact: document.querySelector('#phone-number')
      ? document.querySelector('#phone-number').textContent
      : '',
    rawLocationLink: document.querySelector('.google-maps-link')
      ? document.querySelector('.google-maps-link').dataset.uri
      : '',
    rawAddress: document.querySelector('.address')
      ? document.querySelector('.address').textContent
      : '',
  };

  return details;
}

/**
 * Scrape fields from selMenu node into an object
 * @category async
 * @param {HTMLElement} selMenu
 * @return {Promise<object>}
 */
async function fieldsFromPanel(selMenu) {
  fieldsToExtract = ['Liczba pokoi', 'Wielkość (m2)', 'Na sprzedaż przez'];
  fieldLabels = [...selMenu.querySelectorAll('.attribute > .name')];
  fieldValues = [...selMenu.querySelectorAll('.attribute > .value')];
  fieldIndicesToExtract = fieldLabels
    .map((label, index) =>
      fieldsToExtract.indexOf(label.textContent) > -1 ? index : null
    )
    .filter((key) => key !== null);

  fields = fieldIndicesToExtract.reduce(
    (fieldObj, index) => ({
      ...fieldObj,
      [fieldLabelsToProps(fieldLabels[index].textContent)]: fieldValues[index]
        .textContent,
    }),
    {}
  );

  return fields;
}

/**
 * Translate scraped label into property names friendly string
 * @param {string} fieldLabel
 * @return {Promise<string>}
 */
function fieldLabelsToProps(fieldLabel) {
  switch (fieldLabel) {
    case 'Liczba pokoi':
      return 'rawRooms';
    case 'Wielkość (m2)':
      return 'rawArea';
    case 'Na sprzedaż przez':
      return 'rawSeller';
    default:
      return 'unknown';
  }
}

/**
 * Fix and add fields to fetched offer details data
 * @alias module:scraping-gumtree
 * @param {object} detailedOffer - one offer details
 * @return {object} enhanced details
 */
function enhanceDetails(detailedOffer) {
  return {
    ...detailedOffer,
    area: castToNumber(detailedOffer.rawArea),
    rooms: rawRoomsToRooms(detailedOffer.rawRooms),
    seller: rawSellerToSeller(detailedOffer.rawSeller),
    address: rawAddressToAddress(detailedOffer.rawAddress),
    rawCoords: rawLocationToRawCoords(detailedOffer.rawLocationLink),
  };
}

/**
 * @param {string} scrapedUrl - scraped gumtree's original absolute url string
 * @param {string} lastPageUrl - scraped gumtree's last search result page relative url string
 * @return {string} gumtree's last search result page absolute url string
 */
function recreateAbsoluteUrl(scrapedUrl, lastPageUrl) {
  const url = new URL(scrapedUrl);
  const lastPagePathname = lastPageUrl.split('?')[0];
  url.pathname = lastPagePathname;
  return url.toString();
}

/**
 * @param {string} urlStr - gumtree's offer absolute url
 * @return {number} search result page index
 */
function gumtreeGetPageIndexFromUrl(urlStr) {
  const url = new URL(urlStr);
  const basePathnameEnd = url.pathname.lastIndexOf('p') + 1;
  const pageIndex = url.pathname.substr(basePathnameEnd);
  return pageIndex;
}

/**
 * @param {string} relativeUrl - gumtree's offer relative url
 * @return {string|''} gumtree's offer absolute url
 */
function generateAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return '';
  return `https://www.gumtree.pl${relativeUrl}`;
}

/**
 * @param {string} rawLocation - gumtree's location string like 'District, City'
 * @return {string|''} district
 */
function rawLocationToDistrict(rawLocation) {
  if (!rawLocation) return '';
  const [district] = rawLocation.split(',');
  return district.trim();
}

/**
 * @param {string} rawLocation - gumtree's location string like 'District, City'
 * @return {string|''} city
 */
function rawLocationToCity(rawLocation) {
  if (!rawLocation) return '';
  if (rawLocation.split(',').length > 1)
    return rawLocation.split(',')[1].trim();
  return '';
}

/**
 * @param {string} rawDatetime - gumtree's date string
 * @return {string} date string like 'YYYY-MM-DD'
 */
function rawDatetimeToDate(rawDatetime) {
  const now = new Date();
  const offset = rawDatetimeToOffset(rawDatetime);
  const offsetType = rawDatetimeToType(rawDatetime);
  return toIsoDate(offsetDate(now, offset, offsetType));
}

/**
 * @param {string} rawDatetime - gumtree's date string
 * @return {string} like '01:25'
 */
function rawDatetimeToTime(rawDatetime) {
  const now = new Date();
  const offset = rawDatetimeToOffset(rawDatetime);
  const offsetType = rawDatetimeToType(rawDatetime);
  return getTimeFromDate(offsetDate(now, offset, offsetType));
}

/**
 * @param {Date} date
 * @return {string} like '01:25'
 */
function getTimeFromDate(date) {
  const hours = ('00' + date.getHours()).substr(-2);
  const minutes = ('00' + date.getMinutes()).substr(-2);
  return `${hours}:${minutes}`;
}

/**
 * @param {string} rawDatetime - gumtree's date string
 * @return {string} offsetType - 'minute'/'hour'/'day'/'month'/'year'
 */
function rawDatetimeToType(rawDatetime) {
  if (rawDatetime.includes('minut')) return 'minute';
  if (rawDatetime.includes('godzin')) return 'hour';
  if (rawDatetime.includes('dzień') || rawDatetime.includes('dni'))
    return 'day';
  if (rawDatetime.includes('mies')) return 'month';
  return 'year';
}

/**
 * @param {string} rawDatetime - gumtree date string
 * @return {number} offset number
 */
function rawDatetimeToOffset(rawDatetime) {
  const intOffset = parseInt(rawDatetime);
  return Number.isNaN(intOffset) ? 1 : intOffset;
}

/**
 * @param {Date} now
 * @param {number} offset
 * @param {string} offsetType - 'minute'/'hour'/'day'/'month'/'year'
 * @return {Date} offsetted date
 */
function offsetDate(now, offset, offsetType) {
  switch (offsetType) {
    case 'minute':
      return new Date(now.setMinutes(now.getMinutes() - offset));
    case 'hour':
      return new Date(now.setHours(now.getHours() - offset));
    case 'day':
      return new Date(now.setDate(now.getDate() - offset));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - offset));
    case 'year':
    default:
      return new Date(now.getFullYear() - offset, 11, 31);
  }
}

/**
 * @param {string} rawRooms
 * @return {number|''} - parsed into number
 */
function rawRoomsToRooms(rawRooms) {
  if (!rawRooms) return '';
  if (rawRooms === 'Kawalerka lub garsoniera') return 1;
  return parseInt(rawRooms);
}

/**
 * @param {string} rawSeller - seller type string
 * @return {string|null} 'Osoba prywatna'/'Biuro / Deweloper'
 */
function rawSellerToSeller(rawSeller) {
  if (!rawSeller) return null;
  if (rawSeller === 'Właściciel') return 'Osoba prywatna';
  if (rawSeller === 'Agencja') return 'Biuro / Deweloper';
  return rawSeller;
}

/**
 * @param {string} rawAddress
 * @return {string|null} - address string without 'Warszawa'
 */
function rawAddressToAddress(rawAddress) {
  if (!rawAddress) return null;
  return rawAddress.replace('Warszawa', '');
}

/**
 * Extract coords from google map link
 * @param {string} rawLocationLink - raw google map location link
 * @return {Array.<string>|null} [x, y]
 */
function rawLocationToRawCoords(rawLocationLink) {
  if (!rawLocationLink) return null;
  searchStr = new URL(rawLocationLink).search;
  const rawCoords = searchStr.replace('?q=', '').split(',');
  if (rawCoords.length === 2) return rawCoords;
  return null;
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
