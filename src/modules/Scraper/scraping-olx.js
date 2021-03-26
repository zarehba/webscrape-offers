/**
 * Module scraping olx.pl offers (otodom.pl offers are posted here as well).
 * Utilizing puppetter library as simple parsing of html is not enough to meet the needs,
 * some data gets into html only after clicking some elements and getting another server response.
 * @module scraping-olx
 */

const puppeteer = require('puppeteer');
const { consLog, consError, tryAndDo } = require('../shared');
const {
  toIsoDate,
  rawPriceToNumber,
  castToNumber,
} = require(`./scrapingShared`);
const {
  DEBUG_MODE_WITH_DEVTOOLS,
  SAVE_LOGS,
  API_TIMEOUT_SECONDS,
} = require('../../Config');
const BROWSER_VIEWPORT = { width: 1280, height: 640 };

/**
 * Olx currently returns 25 result pages at maximum
 * @alias module:scraping-olx
 */
const MAX_PAGES = 25;

/**
 * Launches browser; retrieves puppeteer browser handle
 * @category async
 * @alias module:scraping-olx
 * @return {Promise<object>} puppeteer browser handle
 */
async function launchBrowser() {
  const browser = await tryAndDo(
    async () =>
      await puppeteer.launch({
        devtools: DEBUG_MODE_WITH_DEVTOOLS,
      }),
    (err) => {
      if (SAVE_LOGS) consError(`There was an error with puppeteer:\n${err}`);
      throw new Error(err);
    }
  );
  return browser;
}

/**
 * Retrieves puppeteer browser tab handle
 * @alias module:scraping-olx
 * @category async
 * @param {object} browser puppeteer browser handle
 * @return {Promise<object>} puppeteer browser tab handle
 */
async function getBrowserTab(browser) {
  try {
    const browserTab = await browser.pages().then((pages) => pages[0]);
    await browserTab.setViewport(BROWSER_VIEWPORT);
    return browserTab;
  } catch (err) {
    throw new Error(`There was an error with puppeteer:\n${err}`);
  }
}

/**
 * Navigates to a page with puppeteer's .goto()
 * @category async
 * @param {string} pageUrl
 * @param {object} browserTab puppeteer browser tab handle
 */
async function navigateToPage(pageUrl, browserTab) {
  try {
    if (SAVE_LOGS) console.time('Page loaded in');
    await browserTab.goto(pageUrl, { timeout: API_TIMEOUT_SECONDS * 1000 });
    if (SAVE_LOGS) console.timeEnd('Page loaded in');
  } catch (err) {
    if (SAVE_LOGS) console.timeEnd('Page loaded in');
    throw new Error(`There was an error navigating to page:\n${err}`);
  }
}

/**
 * Executes supplied function in browser execution context with puppeteer's .evaluate()
 * @category async
 * @param {function} evaluatedFunc
 * @param {object} browserTab puppeteer browser tab handle
 * @return {Promise<any>} value returned by evaluatedFunc
 */
async function evaluateOnPage(evaluatedFunc, browserTab) {
  try {
    return await browserTab.evaluate(evaluatedFunc);
  } catch (err) {
    throw new Error(`There was an error evaluating on page:\n${err}`);
  }
}

/**
 * Returns search result page index from supplied relative url string
 * @category async
 * @alias module:scraping-olx
 * @param {string} pageUrl
 * @param {object} browserTab puppeteer browser tab handle
 * @return {Promise<number>} last page index
 */
async function getAvailablePagesNumber(pageUrl, browserTab) {
  await navigateToPage(pageUrl, browserTab);
  const lastPageNumber = await evaluateOnPage(
    () => document.querySelector('[data-cy="page-link-last"]').textContent,
    browserTab
  );
  return +lastPageNumber;
}

/**
 * Returns search result page url string with supplied page index
 * @alias module:scraping-olx
 * @param {string} pageUrl - base url string
 * @param {number|string} pageIndex - url parameter
 * @return {string}
 */
const setPageIndex = (pageUrl, pageIndex) => pageUrl + pageIndex;

/**
 * Checks if olx offer was added yesterday
 * @alias module:scraping-olx
 * @param {object} offer
 * @return {boolean}
 */
const isYesterdaysOffer = (offer) =>
  offer.rawDatetime.substr(0, 7) === 'wczoraj';

/**
 * Checks if olx offer was added today
 * @alias module:scraping-olx
 * @param {object} offer
 * @return {boolean}
 */
const isTodaysOffer = (offer) => offer.rawDatetime.substr(0, 7) === 'dzisiaj';

/**
 * Navigate to and scrape an olx page with offer summaries
 * @alias module:scraping-olx
 * @category async
 * @param {string} pageUrl - offer summaries page url
 * @param {object} browserTab puppeteer browser tab handle
 * @return {Promise<Array.<object>>} offer summaries
 */
async function getSummaries(pageUrl, browserTab) {
  await navigateToPage(pageUrl, browserTab);
  const fetchedSummaries = await evaluateOnPage(
    scrapeOlxOtodomSummaries,
    browserTab
  );
  return fetchedSummaries;
}

/**
 * Scrape offer summaries from a page.
 * This function gets executed in browser
 * @return {Array<object>} offer summaries
 */
function scrapeOlxOtodomSummaries() {
  const offers = Array.from(
    document.querySelectorAll('.dontHasPromoted + ul > li')
  );
  const offersSummaries = offers.map((offer) => {
    return {
      id: offer.dataset.id,
      title: offer.querySelector('.inner strong').innerText,
      url: offer.querySelector('.inner .link').getAttribute('href'),
      thumbnail: offer.querySelector('.tdnone img')
        ? offer.querySelector('.tdnone img').getAttribute('src')
        : null,
      rawLocation: offer.querySelectorAll('.date-location > li')[0].innerText,
      rawDatetime: offer.querySelectorAll('.date-location > li')[1].innerText,
      rawPrice: offer.querySelector('.price').innerText,
      isPriceNegotiable: !!offer.querySelector('.price > span'),
      isOfferPromoted: offer.classList.contains('promoted'),
    };
  });
  return offersSummaries;
}

/**
 * Determine whether link leads to olx or otodom page and execute proper scraping function
 * @alias module:scraping-olx
 * @category async
 * @param {string} pageUrl - offer details page url
 * @param {object} browserTab puppeteer browser tab handle
 * @return {Promise<object>} offer details
 */
async function getDetails(pageUrl, browserTab) {
  if (SAVE_LOGS) consLog(`Scraping details of: ${pageUrl}`);

  const scrapeFunction = pageUrl.includes('otodom.pl')
    ? getOtodomDetails
    : pageUrl.includes('olx.pl')
    ? getOlxDetails
    : null;
  if (!scrapeFunction) return null;

  const scrapedDetails = await tryAndDo(
    async () => scrapeFunction(pageUrl, browserTab),
    (err) => {
      if (SAVE_LOGS)
        consError(
          `There was an error scraping offer details from ${pageUrl}:\n${err}`
        );
    }
  );

  return scrapedDetails;
}

/**
 * Navigate to and scrape an olx page with offer details
 * @category async
 * @param {string} pageUrl - offer details page url
 * @param {object} browserTab puppeteer browser tab handle
 * @return {Promise<object>} offer details
 */
async function getOlxDetails(pageUrl, browserTab) {
  await navigateToPage(pageUrl, browserTab);
  await browserTab.waitForSelector('#root', { timeout: 5000 });
  const fetchedDetails = await evaluateOnPage(scrapeOlxDetails, browserTab);

  try {
    await browserTab.waitForSelector('[data-cy="ad-contact-phone"]', {
      timeout: 5000,
    });
    if (
      !(await evaluateOnPage(
        () => document.querySelector('[data-cy="ad-contact-phone"]'),
        browserTab
      ))
    ) {
      return fetchedDetails;
    }
    await browserTab.click('[data-cy="ad-contact-phone"]');
    await browserTab.waitFor(250);
    fetchedDetails.sellerContact = await evaluateOnPage(
      () => document.querySelector('[data-cy="ad-contact-phone"]').innerText,
      browserTab
    );
    fetchedDetails.sellerName = await evaluateOnPage(
      () => document.querySelector('[data-cy="seller_card"] h2').innerText,
      browserTab
    );
  } catch (err) {
    if (SAVE_LOGS)
      consError(
        `There was an error fetching contact details from ${pageUrl}:\n${err}`
      );
  }

  return fetchedDetails;
}

/**
 * Scrape offer details from an olx page.
 * This function gets executed in browser
 * @return {Array<object>} offer details1
 */
function scrapeOlxDetails() {
  function olxDetailNameToKey(keyName, index) {
    switch (keyName) {
      case 'Oferta od':
        return 'rawSeller';
      case 'Cena za m²':
        return 'rawPricem2';
      case 'Poziom':
        return 'floor';
      case 'Umeblowane':
        return 'interiorStatus';
      case 'Rynek':
        return 'market';
      case 'Rodzaj zabudowy':
        return 'buildingType';
      case 'Powierzchnia':
        return 'rawArea';
      case 'Liczba pokoi':
        return 'rawRooms';
      case 'Finanse':
        return 'finance';
      default:
        return `unknown${index}`;
    }
  }

  //before olx switched to css-in-js:
  // const offerDetails = Array.from(
  //   document.querySelectorAll('.offer-details__param')
  // ).reduce((details, detail, index) => {
  //   const keyName = detail
  //     .querySelector('.offer-details__name')
  //     .innerText.trim();
  //   const value = detail
  //     .querySelector('.offer-details__value')
  //     .innerText.trim();
  //   const key = olxDetailNameToKey(keyName, index);
  //   if (key === 'finance') return { ...details };
  //   return { ...details, [key]: value };
  // }, {});

  // offerDetails.description = document
  //   .querySelector('#textContent')
  //   .textContent.trim();

  // new olx version:
  const offerDetails = Array.from(
    document.querySelectorAll('.css-ox1ptj')
  ).reduce((details, detailLi) => {
    const [keyName, value] = detailLi.innerText.split(': ');
    const key = olxDetailNameToKey(keyName);
    if (!value) return { ...details };
    return { ...details, [key]: value };
  }, {});

  offerDetails.description = document
    .querySelector('.css-g5mtbi-Text')
    .textContent.trim();

  // remove cookies popup
  document.querySelector('#onetrust-consent-sdk').remove();

  return offerDetails;
}

/**
 * Navigate to and scrape an otodom page with offer details
 * @category async
 * @param {string} pageUrl - offer details page url
 * @param {object} browserTab puppeteer browser tab handle
 * @return {Promise<object>} offer details
 */
async function getOtodomDetails(pageUrl, browserTab) {
  await navigateToPage(pageUrl, browserTab);

  const fetchedDetails = await evaluateOnPage(_scrapeOtodometails, browserTab);
  try {
    await browserTab.waitForSelector('.phoneNumber button', { timeout: 5000 });
    // await browserTab.click('.phoneNumber button');
    await evaluateOnPage(
      () => document.querySelector('.phoneNumber button').click(),
      browserTab
    );
    await browserTab.waitForSelector('[href^="tel:"]', { timeout: 3000 });
    fetchedDetails.sellerContact = await evaluateOnPage(
      () => document.querySelector('[href^="tel:"]').innerText,
      browserTab
    );
  } catch (err) {
    if (SAVE_LOGS)
      consError(
        `There was an error fetching contact details from ${pageUrl}:\n${err}`
      );
  }
  try {
    await browserTab.waitForSelector('#map', { timeout: 5000 });
    await evaluateOnPage(
      () => document.querySelector('#map').scrollIntoView(),
      browserTab
    );
    await browserTab.waitForSelector(
      '[title^="Pokaż ten obszar w Mapach Google"]',
      {
        timeout: 8000,
      }
    );
    fetchedDetails.rawLocationLink = await evaluateOnPage(() => {
      if (
        document.querySelector('#map > div > div > div').textContent ===
        'Nieruchomość znajduje się w zaznaczonym obszarze mapy. Niestety ogłoszeniodawca nie wskazał dokładnego adresu.'
      ) {
        return null;
      }
      return document
        .querySelector('[title^="Pokaż ten obszar w Mapach Google"]')
        .getAttribute('href');
    }, browserTab);
  } catch (err) {
    if (SAVE_LOGS)
      consError(
        `There was an error fetching address details from ${pageUrl}:\n${err}`
      );
  }

  return fetchedDetails;
}

/**
 * Scrape offer details from an otodom page.
 * This function gets executed in browser
 * @return {Array<object>} offer details1
 */
function _scrapeOtodometails() {
  const offerNodes = {
    rawAddress: document.querySelector('[aria-label="Adres"]'),
    rawPricem2: document.querySelector(
      '[aria-label="Cena za metr kwadratowy"]'
    ),
    rawArea: document.querySelector(
      '[aria-label="Powierzchnia"] > div:nth-child(2)'
    ),
    rawRooms: document.querySelector(
      '[aria-label="Liczba pokoi"] > div:nth-child(2)'
    ),
    market: document.querySelector('[aria-label="Rynek"] > div:nth-child(2)'),
    buildingType: document.querySelector(
      '[aria-label="Rodzaj zabudowy"] > div:nth-child(2)'
    ),
    floor: document.querySelector('[aria-label="Piętro"] > div:nth-child(2)'),
    heating: document.querySelector(
      '[aria-label="Ogrzewanie"] > div:nth-child(2)'
    ),
    buildingMaterial: document.querySelector(
      '[aria-label="Materiał budynku"] > div:nth-child(2)'
    ),
    windowType: document.querySelector(
      '[aria-label="Okna"] > div:nth-child(2)'
    ),
    buildYear: document.querySelector(
      '[aria-label="Rok budowy"] > div:nth-child(2)'
    ),
    availabilityDate: document.querySelector(
      '[aria-label="Dostępne od"] > div:nth-child(2)'
    ),
    interiorStatus: document.querySelector(
      '[aria-label="Stan wykończenia"] > div:nth-child(2)'
    ),
    rentPrice: document.querySelector(
      '[aria-label="Czynsz"] > div:nth-child(2)'
    ),
    legalStatus: document.querySelector(
      '[aria-label="Forma własności"] > div:nth-child(2)'
    ),
    sellerName: document.querySelector('.contactPersonName'),
    rawSeller: !document.querySelector('.contactPersonName')
      ? ''
      : document
          .querySelector('.contactPersonName')
          .closest('aside')
          .querySelector('div > div > div'),
    description: document.querySelector('[data-cy="adPageAdDescription"]'),
  };

  const offerDetails = {};
  Object.entries(offerNodes).forEach(([infoLabel, infoNode]) => {
    if (!infoNode) return;
    offerDetails[infoLabel] = infoNode.innerText;
  });
  return offerDetails;
}

/**
 * Fix and add fields to fetched offer summary data
 * @alias module:scraping-olx
 * @param {object} summary - one offer summary
 * @return {object} enhanced summary
 */
function enhanceSummary(summary) {
  return {
    ...summary,
    id: olxIdToId(summary.id),
    url: cleanTheUrl(summary.url),
    date: olxRawDatetimeToDate(summary.rawDatetime),
    time: olxRawDatestringToTime(summary.rawDatetime),
    city: olxRawLocationToCity(summary.rawLocation),
    district: olxRawLocationToDistrict(summary.rawLocation),
    price: rawPriceToNumber(summary.rawPrice),
    isOfferPromoted: olxBoolToString(summary.isOfferPromoted),
    isPriceNegotiable: olxBoolToString(summary.isPriceNegotiable),
  };
}

/**
 * Fix and add fields to fetched offer details data
 * @alias module:scraping-olx
 * @param {object} detailedOffer - one offer details
 * @return {object} enhanced details
 */
function enhanceDetails(detailedOffer) {
  return {
    ...detailedOffer,
    area: olxRawAreaToArea(detailedOffer.rawArea),
    pricem2: rawPriceToNumber(detailedOffer.rawPricem2),
    rooms: olxRawRoomsToRooms(detailedOffer.rawRooms),
    market: olxMarketToMarket(detailedOffer.market),
    address: olxAddressToAddress(detailedOffer.rawAddress),
    interiorStatus: olxInteriorStatus(detailedOffer.interiorStatus),
    seller: olxRawSellerToSeller(detailedOffer.rawSeller),
    floor: olxFloorToFloorNumber(detailedOffer.floor),
    buildYear: castToNumber(detailedOffer.buildYear),
    buildingType: castToLowerCase(detailedOffer.buildingType),
    locationLink: googlemapLinkToJakdojadeLink(detailedOffer.rawLocationLink),
    rawCoords: olxRawLocationToRawCoords(detailedOffer.rawLocationLink),
  };
}

/**
 * @param {string} str
 * @return {string|null} lower case string
 */
function castToLowerCase(str) {
  if (!str) return '';
  return str.toLowerCase();
}

/**
 * This function gets rid of '#' and special characters at the end of url string
 * @param {string} url
 * @return {string|null} cleaned url string
 */
function cleanTheUrl(url) {
  if (!url) return null;
  let cleanedUrl = url.split('#')[0];
  if (cleanedUrl.substr(-1) === '?') cleanedUrl = cleanedUrl.slice(0, -1);
  return cleanedUrl;
}

/**
 * Object for translating olx months names into numbers
 */
const months = {
  sty: 0,
  lut: 1,
  mar: 2,
  kwi: 3,
  maj: 4,
  cze: 5,
  lip: 6,
  sie: 7,
  wrz: 8,
  paź: 9,
  lis: 10,
  gru: 11,
};

/**
 * @return {number} current year
 */
const currentYear = () => new Date().getFullYear();

/**
 * @param {string} olxDate - olxDate's date string
 * @return {Date} date from parsing the string like
 */
function olxDateStringToDate(olxDate) {
  const [day, monthName] = olxDate;
  return new Date(currentYear(), months[monthName], +day + 1);
}

/**
 * @param {Date} date
 * @return {Date} date one day before parameter date
 */
const toYesterday = (date) => new Date(date.setDate(date.getDate() - 1));

/**
 * @param {string} rawDatetime - olxDate's date string
 * @return {string|null} date string like 'YYYY-MM-DD'
 */
function olxRawDatetimeToDate(rawDatetime) {
  const olxDate = rawDatetime.split(' ');
  const now = new Date();
  switch (olxDate[0]) {
    case 'dzisiaj':
      return toIsoDate(now);
    case 'wczoraj':
      return toIsoDate(toYesterday(now));
    default:
      if (!Number.isNaN(+olxDate[0])) {
        return toIsoDate(olxDateStringToDate(olxDate));
      }
      return '';
  }
}

/**
 * @param {string} rawDatetime - olxDate's date string like 'MMM hh:mi'
 * @return {string|null} olx time string like 'hh:mi'
 */
function olxRawDatestringToTime(rawDatetime) {
  const olxDate = rawDatetime.split(' ');
  switch (olxDate[0]) {
    case 'dzisiaj':
    case 'wczoraj':
      return olxDate[1];
    default:
      return '';
  }
}

/**
 * @param {string|null} rawLocation - olx string like 'City, District'
 * @return {string|''} city name
 */
function olxRawLocationToCity(rawLocation) {
  const [city] = rawLocation.split(',');
  return city.trim();
}

/**
 * @param {string|null} rawLocation - olx string like 'City, District'
 * @return {string|''} district name
 */
function olxRawLocationToDistrict(rawLocation) {
  if (rawLocation.split(',').length > 1)
    return rawLocation.split(',')[1].trim();
  return '';
}

/**
 * @param {string|null} olxId - olx id string
 * @return {number} pseudorandom id if olx id is null
 */
function olxIdToId(olxId) {
  if (olxId) return +olxId;
  return Math.random().toString().split('.')[1];
}

/**
 * @param {string} rawArea - olx string
 * @return {number|null} number of square meters
 */
function olxRawAreaToArea(rawArea) {
  if (!rawArea) return null;
  const area = rawArea.replace(',', '.').split(' ')[0];
  return +area;
}

/**
 * @param {string} rawRooms - olx string
 * @return {number|null} number of rooms
 */
function olxRawRoomsToRooms(rawRooms) {
  if (!rawRooms) return null;
  const rooms = rawRooms.split(' ')[0];
  return +rooms;
}

/**
 * @param {string} interiorStatus - olx string: 'Tak'/'Nie'
 * @return {string|null}  'umeblowane'/'nieumeblowane'
 */
function olxInteriorStatus(interiorStatus) {
  if (!interiorStatus) return null;
  if (interiorStatus === 'Tak') return 'umeblowane';
  if (interiorStatus === 'Nie') return 'nieumeblowane';
  return null;
}

/**
 * @param {string} market - olx string
 * @return {string|null} lowercase market string
 */
function olxMarketToMarket(market) {
  if (!market) return '';
  return market.toLowerCase();
}

/**
 * @param {string} address - olx string
 * @return {string|null} address with removed its city part
 */
function olxAddressToAddress(address) {
  if (!address) return ' ';

  const addressParts = address.split(',');
  if (addressParts.length <= 2) return ' ';

  return addressParts.slice(2).join(',');
}

/**
 * @param {string} rawSeller - seller type olx string
 * @return {string|null} 'Osoba prywatna'/'Biuro / Deweloper'
 */
function olxRawSellerToSeller(rawSeller) {
  if (!rawSeller) return null;
  if (
    rawSeller === 'Osoby prywatnej' ||
    rawSeller.toLowerCase() === 'oferta prywatna'
  )
    return 'Osoba prywatna';
  if (
    rawSeller.toLowerCase() === 'oferta biura nieruchomości' ||
    rawSeller.toLowerCase() === 'oferta dewelopera'
  )
    return 'Biuro / Deweloper';
  return rawSeller;
}

/**
 * @param {string} floor
 * @return {number|null}
 */
function olxFloorToFloorNumber(floor) {
  if (!floor && floor !== '0') return null;
  if (Number.isNaN(+floor)) return 99;
  return +floor;
}

/**
 * @param {boolean} bool
 * @return {string} 'tak'/'nie'
 */
function olxBoolToString(bool) {
  if (bool) return 'tak';
  return 'nie';
}

/**
 * Extract coords from google map link
 * @param {string} googlemapUrl
 * @return {Array.<string>|null} [x, y]
 */
function olxRawLocationToRawCoords(googlemapUrl) {
  if (!googlemapUrl) return null;
  const gmUrl = new URL(googlemapUrl);
  const params = new URLSearchParams(gmUrl.search);
  const [x, y] = params.get('ll').split(',');

  return [x, y];
}

/**
 * Extract coords from google map link and insert them into jakdojade link
 * @param {string} googlemapUrl
 * @returns {string|null}
 */
function googlemapLinkToJakdojadeLink(googlemapUrl) {
  const JAKDOJADE_BASELINK =
    'https://jakdojade.pl/warszawa/trasa/?tc=52.22968:21.01017&fc=${x}:${y}&fn=MIESZKANIE&tn=CENTRUM&h=12:05&act=3';
  const coords = olxRawLocationToRawCoords(googlemapUrl);
  if (!coords) return null;

  const jakdojadeLink = JAKDOJADE_BASELINK.replace('${x}', coords[0]).replace(
    '${y}',
    coords[1]
  );

  return jakdojadeLink;
}

module.exports = {
  MAX_PAGES,
  launchBrowser,
  getBrowserTab,
  getAvailablePagesNumber,
  setPageIndex,
  isTodaysOffer,
  isYesterdaysOffer,
  getSummaries,
  getDetails,
  enhanceSummary,
  enhanceDetails,
};
