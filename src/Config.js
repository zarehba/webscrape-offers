/**
 * Configuration file.
 * @module Config
 */

module.exports = {
  /**
   * Enables saving log files with process running information and partial data.\
   * Accepts values: *true* | *false*
   * @param {bool}
   * @category general configuration
   */
  SAVE_LOGS: true,
  /**
   * Enables sending mail notifications about new offers and proces errors.\
   * Accepts values: *true* | *false*
   * @category general configuration
   * @param {bool}
   */
  SEND_MAIL: false,
  /**
   * Enables saving appending new offers to excel 'database'.\
   * Accepts values: *true* | *false*
   * @category general configuration
   * @param {bool}
   */
  SAVE_TO_EXCEL: true,
  /**
   * If enabled, browser is opened with devTools on while scraping data.\
   * If disabled, browser runs in headless mode (UI is invisible).\
   * Accepts values: *true* | *false*
   * @category general configuration
   * @param {bool}
   */
  DEBUG_MODE_WITH_DEVTOOLS: false,
  /**
   * Enables running scraping process at a time interval.\
   * Accepts values: *true* | *false*
   * @param {bool}
   * @category general configuration
   */
  RUN_INTERVALS: true,
  /**
   * Specifies the time interval for the process\
   * Accepts numerical values of miliseconds
   * @param {number}
   * @category general configuration
   */
  REFRESH_TIME: 14400000,
  /**
   * Websites to scrape data from.\
   * Accepts a list of values: *'olx'* | *'gumtree'*
   * @category scraping configuration
   * @param {bool}
   */
  ORIGINS_TO_SCRAPE: ['olx', 'gumtree'], // ['olx', 'gumtree', 'empik']
  /**
   * URLs of search result pages to scrape data from services listed in ORIGINS_TO_SCRAPE variable\
   * Accepts URL strings
   * @category scraping configuration
   * @param {{olx: Array<string>, gumtree: Array<string>}}
   * @example {
   *  olx: [
   *    'https://www.olx.pl/nieruchomosci/mieszkania/sprzedaz/q-Warszawa/?search%5Bfilter_float_price%3Ato%5D=600000&search%5Bfilter_float_price_per_m%3Ato%5D=13000&search%5Bfilter_enum_floor_select%5D%5B0%5D=floor_1&search%5Bfilter_enum_floor_select%5D%5B1%5D=floor_2&search%5Bfilter_enum_floor_select%5D%5B2%5D=floor_3&search%5Bfilter_enum_floor_select%5D%5B3%5D=floor_4&search%5Bfilter_enum_floor_select%5D%5B4%5D=floor_5&search%5Bfilter_enum_floor_select%5D%5B5%5D=floor_6&search%5Bfilter_enum_floor_select%5D%5B6%5D=floor_7&search%5Bfilter_enum_floor_select%5D%5B7%5D=floor_8&search%5Bfilter_enum_floor_select%5D%5B8%5D=floor_9&search%5Bfilter_enum_floor_select%5D%5B9%5D=floor_10&search%5Bfilter_enum_floor_select%5D%5B10%5D=floor_11&search%5Bfilter_enum_floor_select%5D%5B11%5D=floor_17&search%5Bfilter_float_m%3Ato%5D=50&search%5Bfilter_float_m%3Afrom%5D=20&search%5Bfilter_enum_rooms%5D%5B0%5D=one&search%5Bfilter_enum_rooms%5D%5B1%5D=two&view=galleryWide&page=',
   *  ]
   * }
   */
  URLS_TO_SCRAPE: {
    olx: [
      'https://www.olx.pl/nieruchomosci/mieszkania/sprzedaz/q-Warszawa/?search%5Bfilter_float_price%3Ato%5D=600000&search%5Bfilter_float_price_per_m%3Ato%5D=13000&search%5Bfilter_enum_floor_select%5D%5B0%5D=floor_1&search%5Bfilter_enum_floor_select%5D%5B1%5D=floor_2&search%5Bfilter_enum_floor_select%5D%5B2%5D=floor_3&search%5Bfilter_enum_floor_select%5D%5B3%5D=floor_4&search%5Bfilter_enum_floor_select%5D%5B4%5D=floor_5&search%5Bfilter_enum_floor_select%5D%5B5%5D=floor_6&search%5Bfilter_enum_floor_select%5D%5B6%5D=floor_7&search%5Bfilter_enum_floor_select%5D%5B7%5D=floor_8&search%5Bfilter_enum_floor_select%5D%5B8%5D=floor_9&search%5Bfilter_enum_floor_select%5D%5B9%5D=floor_10&search%5Bfilter_enum_floor_select%5D%5B10%5D=floor_11&search%5Bfilter_enum_floor_select%5D%5B11%5D=floor_17&search%5Bfilter_float_m%3Ato%5D=50&search%5Bfilter_float_m%3Afrom%5D=20&search%5Bfilter_enum_rooms%5D%5B0%5D=one&search%5Bfilter_enum_rooms%5D%5B1%5D=two&view=galleryWide&page=',
    ],
    gumtree: [
      'https://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/mieszkanie/v1c9073l3200008a1dwp1?pr=,600000&nr=10',
      'https://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/mieszkanie/v1c9073l3200008a1dwp1?pr=,600000&nr=2',
    ],
    // empik: [
    //   'https://www.empik.com/audiobooki-i-ebooki/ebooki,3501,s,${pageParam}?sort=publishAsc&resultsPP=60',
    //   'https://www.empik.com/audiobooki-i-ebooki/audiobooki,3502,s,${pageParam}?resultsPP=60&sort=publishAsc',
    // ],
  },
  /**
   * Enables setting a limit of pages to scrape\
   * Accepts string values: *'today'* | *'yesterday'* or *null* for no limit
   * @category scraping configuration
   * @param {string|null}
   */
  SCRAPE_UNTIL_DATE: 'today',
  /**
   * Enables setting a limit of pages to scrape\
   * Accepts numerical values or *null* for no limit
   * @category scraping configuration
   * @param {number|null}
   */
  SCRAPE_PAGES_COUNT: 1,
  /**
   * Sets a timeout for fetching data requests (recommended)\
   * Accepts values in seconds
   * @category general configuration
   * @param {number}
   */
  API_TIMEOUT_SECONDS: 60,
  /**
   * Sets a number of maximum attempts for fetching data requests (required)
   * @category general configuration
   * @param {number}
   */
  API_MAX_FETCH_ATTEMPTS: 3,

  /**
   * Filepath string to offers folder
   * @param {string}
   * @category folders and files configuration
   */
  DATA_PATH: './offers/',
  /**
   * Filename string for .json and .xlsx *database* file with all offers details
   * @param {string}
   * @category folders and files configuration
   * @example 'all-offers'
   */
  DATA_FILENAME: 'offers',
  /**
   * Filepath string to log folder
   * @param {string}
   * @category folders and files configuration
   */
  LOGS_PATH: './logs/data/',
  /**
   * Filename string for .json log file with new offers details
   * @param {string}
   * @category folders and files configuration
   * @example 'new-offers'
   */
  NEWOFFERS_FILENAME: 'new-offers',
  /**
   * Filename string for .json log file with offers summaries
   * @param {string}
   * @category folders and files configuration
   * @example 'summary'
   */
  SUMMARY_FILENAME: 'summary',
  /**
   * Filename string for .json log file with offers details
   * @param {string}
   * @category folders and files configuration
   * @example 'details'
   */
  DETAILS_FILENAME: 'details',
  /**
   * Excel file headers
   * @param {{details: Array<{header: string, key: string}>}}
   * @category folders and files configuration
   * @example {
   *  details: [
   *   { header: 'Nazwa', key: 'title' },
   *   { header: 'Adres', key: 'address' },
   *  ]
   * }
   */
  EXCEL_HEADER: {
    details: [
      { header: 'Nazwa', key: 'title' },
      { header: 'Adres', key: 'address' },
      { header: 'Adres[link]', key: 'locationLink' },
      { header: 'Dzielnica', key: 'district' },
      { header: 'Pokoje', key: 'rooms' },
      { header: 'Metraż', key: 'area' },
      { header: 'Cena', key: 'price' },
      { header: 'Cena[zł/m2]', key: 'pricem2' },
      { header: 'Rok budowy', key: 'buildYear' },
      { header: 'Ogłoszenie[link]', key: 'url' },
      { header: 'Piętro', key: 'floor' },
      { header: 'Czynsz', key: 'rentPrice' },
      { header: 'Rynek', key: 'market' },
      { header: 'Sprzedawca', key: 'seller' },
      { header: 'Własność', key: 'legalStatus' },
      { header: 'Wnętrze', key: 'interiorStatus' },
      { header: 'Opis', key: 'description' },
      { header: 'Budynek', key: 'buildingType' },
      { header: 'Budynek z:', key: 'buildingMaterial' },
      { header: 'Ogrzewanie', key: 'heating' },
      { header: 'Okna', key: 'windowType' },
      { header: 'Dostępne od', key: 'availabilityDate' },
      { header: 'Data ogł.', key: 'date' },
      { header: 'Godz. ogł.', key: 'time' },
      { header: 'Nazwisko ogł.', key: 'sellerName' },
      { header: 'Kontakt', key: 'sellerContact' },
      { header: 'Obrazek[link]', key: 'thumbnail' },
      { header: 'Cena negocjowalna?', key: 'isPriceNegotiable' },
      { header: 'Oferta promowana?', key: 'isOfferPromoted' },
      { header: 'Miasto', key: 'city' },
      { header: 'id', key: 'id' },
    ],
  },
  /**
   * SMTP connection information
   * @param {object}
   * @category mail configuration
   * @example {
   *  host: 'smtp.mailgun.org',
   *  port: 587,
   *    auth: {
   *      user: 'postmaster@sandbox123456789!@#$%^&*0.mailgun.org',
   *      pass: '123456789!@#$%^&*0123456789!@#$%^&*0'
   *    },
   * }
   */
  MAIL_CONNECTION: {
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  /**
   * Email address of sender
   * @param {string}
   * @category mail configuration
   */
  MAIL_FROM: process.env.EMAIL_SENDER,
  /**
   * List of email addresses of recipients
   * @param {Array<string>}
   * @category mail configuration
   */
  MAIL_TO: [process.env.EMAIL_RECEIVER],
  /**
   * Template for mail notification about new offers.\
   * Values ${newOffersCount}, ${origin} get substituted for actual values.
   * @category mail configuration
   * @example {
   *  subject: 'New offers!',
   *  html: 'There is <b>${newOffersCount}</b> new offers from ${origin}!'
   * }
   */
  MAIL_TEMPLATE: {
    subject: '[Oferty] Dodałem ${newOffersCount} nowe oferty z ${origin}!',
    html: 'Dodałem ${newOffersCount} nowe oferty z ${origin}!',
  },
  /**
   * Template for mail notification about process error.\
   * Value ${errorMsg} gets substituted for error message.
   * @category mail configuration
   * @example {
   *  subject: 'Process error!',
   *  html: 'There was an error:<br/>${errorMsg}'
   * }
   */
  ERROR_MAIL_TEMPLATE: {
    subject: '[Oferty] Proces zakończył się niepowodzeniem!',
    html:
      'Wystąpił błąd!<br/>${errorMsg}<br/><br/>Baza ofert nie została zaktualizowana.',
  },
};
