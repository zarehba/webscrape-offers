# webscrape-offers

## What does this app do?

This node.js app scrapes data from a couple of websites with real estate offers in Poland: gumtree.pl, olx.pl (and otodom.pl).\
I also added a scraper for products from empik.com's ecommerce store.

Adding another source to scrape is easily done as long as the same procedure can be applied:

1. there is a search result page containing lists (summaries) of interesting offers/products, and their IDs
2. search result pages are paginated in a predictable way (e.g. via parameters in URL)
3. if details of offers/products are to be scraped, they should be available via URLs that can be obtained e.g. by substituting acquired IDs into a base URL of sort

Processes for each specified website run in parallel.
Each process starts at page no. 1 of a search results page for a website (this URL is specified in config file as a starting point) and then proceeds to get data from this page and the rest of search result pages until last page is reached.

### Functionalities

Data gets saved as a .json and (optionally) .xslx file.\
Notification about new offers can then be send by email (originally used Mailgun service but there are plenty of others).
Scraping and (optionally) notification process can also be run at time intervals, effectively acquring/notifying about new offers almost as soon as they appear on the websites.

### Configurating the scraper

Enabling/disabling functionalities, specifying URLs to scrape, output files etc. can be done in [Config.js](./src/Config.js) file.\
See the documentation of <a href="#module_Config">Config options</a>.

### Running the app

App can be run within node.js with `npm start` command, as well as directly from shell with `node ./src/App.js` command. Even better, it can be run as in [runApp.sh](./runApp.sh) file, that way errors and regular logs get saved on disk, into their separates files.\
The scraping can run periodically (and save data/send email notifications) at intervals: variables: `RUN_INTERVALS`, `REFRESH_TIME` in config.

### Types of scraping

2 methods of scraping are used:

- (fast, limited method) simply reading server's reponse (fast method) returned from the origin (see e.g. [scraping-gumtree.js](./src/Scraper/scraping-gumtree.js) - using [jsdom](https://github.com/jsdom/jsdom).
- (slower, less limited method) actually rendering the document which allows performing pretty much any action on the website, for instance clicking an element and getting data that was not visible in the original document (see e.g. [scraping-olx.js](./src/Scraper/scraping-olx.js)) - using [Puppeteer](https://github.com/puppeteer/puppeteer/).

### Adding new URL to scrap from known origin (website)

Is easily done in [Config.js](./src/Config.js) in variable `URLS_TO_SCRAPE`.

### Adding new origin (website) to scrape

Is done in [Config.js](./src/Config.js) in variable `ORIGINS_TO_SCRAPE` and `URLS_TO_SCRAPE`. A new `scraping-${origin}.js` script, containing the actual specifics of scraping new origin, has to be added to [Scraper](./src/Scraper) folder. Finally, the scraper has to be added to the constant `DEFINED_SCRAPERS` in [Scraper.js](./src/Scraper/Scraper.js).

### Adding data filtering rules

Business rules for filtering data can be specified in [filtersAndFixes.js](./filtersAndFixes.js) file as functions, e.g. filtering too expensive products/offers. Such conditions have to be then added to the general `filterDataRows` function.

---

---

## DOCUMENTATION:
