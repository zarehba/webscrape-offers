## Modules

<dl>
<dt><a href="#module_App">App</a></dt>
<dd><p>App index file.
Starts the process of scraping data,
runs scraping at time intervals if this option is turned on in config.js,
send mail notification about process error if that option is turned on in config.js</p>
</dd>
<dt><a href="#module_Config">Config</a></dt>
<dd><p>Configuration file.</p>
</dd>
<dt><a href="#module_filtersAndFixes">filtersAndFixes</a></dt>
<dd><p>Module with additional filtering and fixing data functions defined for specific business logic</p>
</dd>
<dt><a href="#module_Excel">Excel</a></dt>
<dd><p>Module utilizing exceljs to append new scraped offers data to .xslx <em>database</em></p>
</dd>
<dt><a href="#module_GetOffers">GetOffers</a></dt>
<dd><p>Main module concerning the process flow.</p>
</dd>
<dt><a href="#module_Scraper">Scraper</a></dt>
<dd><p>Main scraping module</p>
</dd>
<dt><a href="#module_scraping-empik">scraping-empik</a></dt>
<dd><p>Module used for scraping empik.pl ebooks i audiobooks.
Utilizing jsdom library to parse fetched HTML</p>
</dd>
<dt><a href="#module_scraping-gumtree">scraping-gumtree</a></dt>
<dd><p>Module scraping gumtree.pl offers.
Utilizing jsdom library to parse fetched HTML</p>
</dd>
<dt><a href="#module_scraping-olx">scraping-olx</a></dt>
<dd><p>Module scraping olx.pl offers (otodom.pl offers are posted here as well).
Utilizing puppetter library as simple parsing of html is not enough to meet the needs,
some data gets into html only after clicking some elements and getting another server response.</p>
</dd>
<dt><a href="#module_scrapingShared">scrapingShared</a></dt>
<dd><p>Module with functions shared by all specific website scraping modules</p>
</dd>
<dt><a href="#module_SendMail">SendMail</a></dt>
<dd><p>Module utlizing nodemailer to send email notifications about new offers posted on watched (scraped) websites, as well as errors occuring in the process</p>
</dd>
<dt><a href="#module_shared">shared</a></dt>
<dd><p>Module containing utility functions shared throughout the application</p>
</dd>
</dl>

<a name="module_App"></a>

## App
App index file.
Starts the process of scraping data,
runs scraping at time intervals if this option is turned on in config.js,
send mail notification about process error if that option is turned on in config.js

<a name="module_Config"></a>

## Config
Configuration file.


* [Config](#module_Config)
    * _folders and files configuration_
        * [.DATA_PATH](#module_Config.DATA_PATH)
        * [.DATA_FILENAME](#module_Config.DATA_FILENAME)
        * [.LOGS_PATH](#module_Config.LOGS_PATH)
        * [.NEWOFFERS_FILENAME](#module_Config.NEWOFFERS_FILENAME)
        * [.SUMMARY_FILENAME](#module_Config.SUMMARY_FILENAME)
        * [.DETAILS_FILENAME](#module_Config.DETAILS_FILENAME)
        * [.EXCEL_HEADER](#module_Config.EXCEL_HEADER)
    * _general configuration_
        * [.SAVE_LOGS](#module_Config.SAVE_LOGS)
        * [.SEND_MAIL](#module_Config.SEND_MAIL)
        * [.SAVE_TO_EXCEL](#module_Config.SAVE_TO_EXCEL)
        * [.DEBUG_MODE_WITH_DEVTOOLS](#module_Config.DEBUG_MODE_WITH_DEVTOOLS)
        * [.RUN_INTERVALS](#module_Config.RUN_INTERVALS)
        * [.REFRESH_TIME](#module_Config.REFRESH_TIME)
        * [.API_TIMEOUT_SECONDS](#module_Config.API_TIMEOUT_SECONDS)
        * [.API_MAX_FETCH_ATTEMPTS](#module_Config.API_MAX_FETCH_ATTEMPTS)
    * _mail configuration_
        * [.MAIL_CONNECTION](#module_Config.MAIL_CONNECTION)
        * [.MAIL_FROM](#module_Config.MAIL_FROM)
        * [.MAIL_TO](#module_Config.MAIL_TO)
        * [.MAIL_TEMPLATE](#module_Config.MAIL_TEMPLATE)
        * [.ERROR_MAIL_TEMPLATE](#module_Config.ERROR_MAIL_TEMPLATE)
    * _scraping configuration_
        * [.ORIGINS_TO_SCRAPE](#module_Config.ORIGINS_TO_SCRAPE)
        * [.URLS_TO_SCRAPE](#module_Config.URLS_TO_SCRAPE)
        * [.SCRAPE_UNTIL_DATE](#module_Config.SCRAPE_UNTIL_DATE)
        * [.SCRAPE_PAGES_COUNT](#module_Config.SCRAPE_PAGES_COUNT)

<a name="module_Config.DATA_PATH"></a>

### Config.DATA\_PATH
Filepath string to offers folder

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: folders and files configuration  

| Type |
| --- |
| <code>string</code> | 

<a name="module_Config.DATA_FILENAME"></a>

### Config.DATA\_FILENAME
Filename string for .json and .xlsx *database* file with all offers details

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: folders and files configuration  

| Type |
| --- |
| <code>string</code> | 

**Example**  
```js
'all-offers'
```
<a name="module_Config.LOGS_PATH"></a>

### Config.LOGS\_PATH
Filepath string to log folder

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: folders and files configuration  

| Type |
| --- |
| <code>string</code> | 

<a name="module_Config.NEWOFFERS_FILENAME"></a>

### Config.NEWOFFERS\_FILENAME
Filename string for .json log file with new offers details

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: folders and files configuration  

| Type |
| --- |
| <code>string</code> | 

**Example**  
```js
'new-offers'
```
<a name="module_Config.SUMMARY_FILENAME"></a>

### Config.SUMMARY\_FILENAME
Filename string for .json log file with offers summaries

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: folders and files configuration  

| Type |
| --- |
| <code>string</code> | 

**Example**  
```js
'summary'
```
<a name="module_Config.DETAILS_FILENAME"></a>

### Config.DETAILS\_FILENAME
Filename string for .json log file with offers details

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: folders and files configuration  

| Type |
| --- |
| <code>string</code> | 

**Example**  
```js
'details'
```
<a name="module_Config.EXCEL_HEADER"></a>

### Config.EXCEL\_HEADER
Excel file headers

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: folders and files configuration  

| Type |
| --- |
| <code>Object</code> | 

**Example**  
```js
{
 details: [
  { header: 'Nazwa', key: 'title' },
  { header: 'Adres', key: 'address' },
 ]
}
```
<a name="module_Config.SAVE_LOGS"></a>

### Config.SAVE\_LOGS
Enables saving log files with process running information and partial data.\
Accepts values: *true* | *false*

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: general configuration  

| Type |
| --- |
| <code>bool</code> | 

<a name="module_Config.SEND_MAIL"></a>

### Config.SEND\_MAIL
Enables sending mail notifications about new offers and proces errors.\
Accepts values: *true* | *false*

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: general configuration  

| Type |
| --- |
| <code>bool</code> | 

<a name="module_Config.SAVE_TO_EXCEL"></a>

### Config.SAVE\_TO\_EXCEL
Enables saving appending new offers to excel 'database'.\
Accepts values: *true* | *false*

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: general configuration  

| Type |
| --- |
| <code>bool</code> | 

<a name="module_Config.DEBUG_MODE_WITH_DEVTOOLS"></a>

### Config.DEBUG\_MODE\_WITH\_DEVTOOLS
If enabled, browser is opened with devTools on while scraping data.\
If disabled, browser runs in headless mode (UI is invisible).\
Accepts values: *true* | *false*

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: general configuration  

| Type |
| --- |
| <code>bool</code> | 

<a name="module_Config.RUN_INTERVALS"></a>

### Config.RUN\_INTERVALS
Enables running scraping process at a time interval.\
Accepts values: *true* | *false*

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: general configuration  

| Type |
| --- |
| <code>bool</code> | 

<a name="module_Config.REFRESH_TIME"></a>

### Config.REFRESH\_TIME
Specifies the time interval for the process\
Accepts numerical values of miliseconds

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: general configuration  

| Type |
| --- |
| <code>number</code> | 

<a name="module_Config.API_TIMEOUT_SECONDS"></a>

### Config.API\_TIMEOUT\_SECONDS
Sets a timeout for fetching data requests (recommended)\
Accepts values in seconds

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: general configuration  

| Type |
| --- |
| <code>number</code> | 

<a name="module_Config.API_MAX_FETCH_ATTEMPTS"></a>

### Config.API\_MAX\_FETCH\_ATTEMPTS
Sets a number of maximum attempts for fetching data requests (required)

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: general configuration  

| Type |
| --- |
| <code>number</code> | 

<a name="module_Config.MAIL_CONNECTION"></a>

### Config.MAIL\_CONNECTION
SMTP connection information

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: mail configuration  

| Type |
| --- |
| <code>object</code> | 

**Example**  
```js
{
 host: 'smtp.mailgun.org',
 port: 587,
   auth: {
     user: 'postmaster@sandbox123456789!@#$%^&*0.mailgun.org',
     pass: '123456789!@#$%^&*0123456789!@#$%^&*0'
   },
}
```
<a name="module_Config.MAIL_FROM"></a>

### Config.MAIL\_FROM
Email address of sender

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: mail configuration  

| Type |
| --- |
| <code>string</code> | 

<a name="module_Config.MAIL_TO"></a>

### Config.MAIL\_TO
List of email addresses of recipients

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: mail configuration  

| Type |
| --- |
| <code>Array.&lt;string&gt;</code> | 

<a name="module_Config.MAIL_TEMPLATE"></a>

### Config.MAIL\_TEMPLATE
Template for mail notification about new offers.\
Values ${newOffersCount}, ${origin} get substituted for actual values.

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: mail configuration  
**Example**  
```js
{
 subject: 'New offers!',
 html: 'There is <b>${newOffersCount}</b> new offers from ${origin}!'
}
```
<a name="module_Config.ERROR_MAIL_TEMPLATE"></a>

### Config.ERROR\_MAIL\_TEMPLATE
Template for mail notification about process error.\
Value ${errorMsg} gets substituted for error message.

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: mail configuration  
**Example**  
```js
{
 subject: 'Process error!',
 html: 'There was an error:<br/>${errorMsg}'
}
```
<a name="module_Config.ORIGINS_TO_SCRAPE"></a>

### Config.ORIGINS\_TO\_SCRAPE
Websites to scrape data from.\
Accepts a list of values: *'olx'* | *'gumtree'*

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: scraping configuration  

| Type |
| --- |
| <code>bool</code> | 

<a name="module_Config.URLS_TO_SCRAPE"></a>

### Config.URLS\_TO\_SCRAPE
URLs of search result pages to scrape data from services listed in ORIGINS_TO_SCRAPE variable\
Accepts URL strings

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: scraping configuration  

| Type |
| --- |
| <code>Object</code> | 

**Example**  
```js
{
 olx: [
   'https://www.olx.pl/nieruchomosci/mieszkania/sprzedaz/q-Warszawa/?search%5Bfilter_float_price%3Ato%5D=600000&search%5Bfilter_float_price_per_m%3Ato%5D=13000&search%5Bfilter_enum_floor_select%5D%5B0%5D=floor_1&search%5Bfilter_enum_floor_select%5D%5B1%5D=floor_2&search%5Bfilter_enum_floor_select%5D%5B2%5D=floor_3&search%5Bfilter_enum_floor_select%5D%5B3%5D=floor_4&search%5Bfilter_enum_floor_select%5D%5B4%5D=floor_5&search%5Bfilter_enum_floor_select%5D%5B5%5D=floor_6&search%5Bfilter_enum_floor_select%5D%5B6%5D=floor_7&search%5Bfilter_enum_floor_select%5D%5B7%5D=floor_8&search%5Bfilter_enum_floor_select%5D%5B8%5D=floor_9&search%5Bfilter_enum_floor_select%5D%5B9%5D=floor_10&search%5Bfilter_enum_floor_select%5D%5B10%5D=floor_11&search%5Bfilter_enum_floor_select%5D%5B11%5D=floor_17&search%5Bfilter_float_m%3Ato%5D=50&search%5Bfilter_float_m%3Afrom%5D=20&search%5Bfilter_enum_rooms%5D%5B0%5D=one&search%5Bfilter_enum_rooms%5D%5B1%5D=two&view=galleryWide&page=',
 ]
}
```
<a name="module_Config.SCRAPE_UNTIL_DATE"></a>

### Config.SCRAPE\_UNTIL\_DATE
Enables setting a limit of pages to scrape\
Accepts string values: *'today'* | *'yesterday'* or *null* for no limit

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: scraping configuration  

| Type |
| --- |
| <code>string</code> \| <code>null</code> | 

<a name="module_Config.SCRAPE_PAGES_COUNT"></a>

### Config.SCRAPE\_PAGES\_COUNT
Enables setting a limit of pages to scrape\
Accepts numerical values or *null* for no limit

**Kind**: static property of [<code>Config</code>](#module_Config)  
**Category**: scraping configuration  

| Type |
| --- |
| <code>number</code> \| <code>null</code> | 

<a name="module_filtersAndFixes"></a>

## filtersAndFixes
Module with additional filtering and fixing data functions defined for specific business logic


* [filtersAndFixes](#module_filtersAndFixes)
    * [filterDataRows(offer)](#exp_module_filtersAndFixes--filterDataRows) ⇒ <code>bool</code> ⏏
    * [addCalculationColumns(offers)](#exp_module_filtersAndFixes--addCalculationColumns) ⇒ <code>Array.&lt;object&gt;</code> ⏏
    * [deleteChosenCols(offer)](#exp_module_filtersAndFixes--deleteChosenCols) ⇒ <code>object</code> ⏏

<a name="exp_module_filtersAndFixes--filterDataRows"></a>

### filterDataRows(offer) ⇒ <code>bool</code> ⏏
Checks if offer fulfills business requirements specified in private methods in this module

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| offer | <code>object</code> | 

<a name="exp_module_filtersAndFixes--addCalculationColumns"></a>

### addCalculationColumns(offers) ⇒ <code>Array.&lt;object&gt;</code> ⏏
Add columns added by private methods in this module

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| offers | <code>Array.&lt;object&gt;</code> | 

<a name="exp_module_filtersAndFixes--deleteChosenCols"></a>

### deleteChosenCols(offer) ⇒ <code>object</code> ⏏
Remove data that is not supposed to get saved to excel

**Kind**: Exported function  
**Returns**: <code>object</code> - offer without chosen data fields  

| Param | Type |
| --- | --- |
| offer | <code>object</code> | 

<a name="module_Excel"></a>

## Excel
Module utilizing exceljs to append new scraped offers data to .xslx *database*

<a name="exp_module_Excel--module.exports"></a>

### module.exports(data, filepath, worksheetName) ⇒ <code>Promise.&lt;void&gt;</code> ⏏
Reads .xslx file, appends new data after header and fixes hyperlinks in newly added data

**Kind**: Exported function  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;object&gt;</code> | offer details data |
| filepath | <code>string</code> |  |
| worksheetName | <code>string</code> |  |

<a name="module_GetOffers"></a>

## GetOffers
Main module concerning the process flow.


* [GetOffers](#module_GetOffers)
    * [module.exports(origin)](#exp_module_GetOffers--module.exports) ⏏
        * [~getSetOfIds(offers)](#module_GetOffers--module.exports..getSetOfIds) ⇒ <code>Set.&lt;string&gt;</code>
        * [~getNewIds(oldOffers, newOffers)](#module_GetOffers--module.exports..getNewIds) ⇒ <code>Set.&lt;string&gt;</code>
        * [~handleNewOffers(newOffers, allOffers, origin)](#module_GetOffers--module.exports..handleNewOffers)

<a name="exp_module_GetOffers--module.exports"></a>

### module.exports(origin) ⏏
Gets data from websites, saves data to files, sends mail notification about new offers.

**Kind**: Exported function  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| origin | <code>string</code> | scraped website (from ORIGINS_TO_SCRAPE config variable) |

<a name="module_GetOffers--module.exports..getSetOfIds"></a>

#### module.exports~getSetOfIds(offers) ⇒ <code>Set.&lt;string&gt;</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_GetOffers--module.exports)  
**Returns**: <code>Set.&lt;string&gt;</code> - unique offer ids  

| Param | Type | Description |
| --- | --- | --- |
| offers | <code>Array.&lt;object&gt;</code> | offer details |

<a name="module_GetOffers--module.exports..getNewIds"></a>

#### module.exports~getNewIds(oldOffers, newOffers) ⇒ <code>Set.&lt;string&gt;</code>
Gets new ids, i.e. ids which are only present in argument supplied as 2nd one

**Kind**: inner method of [<code>module.exports</code>](#exp_module_GetOffers--module.exports)  
**Returns**: <code>Set.&lt;string&gt;</code> - new unique offer ids  

| Param | Type |
| --- | --- |
| oldOffers | <code>Array.&lt;object&gt;</code> | 
| newOffers | <code>Array.&lt;object&gt;</code> | 

<a name="module_GetOffers--module.exports..handleNewOffers"></a>

#### module.exports~handleNewOffers(newOffers, allOffers, origin)
Function executed if new offers were scraped.\
Saves data to file/s and sends mail notification about new offers.

**Kind**: inner method of [<code>module.exports</code>](#exp_module_GetOffers--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| newOffers | <code>Array.&lt;object&gt;</code> |  |
| allOffers | <code>Array.&lt;object&gt;</code> |  |
| origin | <code>string</code> | scraped website (from ORIGINS_TO_SCRAPE config variable) |

<a name="module_Scraper"></a>

## Scraper
Main scraping module

<a name="exp_module_Scraper--module.exports"></a>

### module.exports(origin) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ⏏
Includes proper functions to scrape the supplied origin parameter, gets the data, saves logs if logs enabled in config

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - detailed offers data  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| origin | <code>string</code> | Currently accepts values: 'olx'/'gumtree' |

<a name="module_scraping-empik"></a>

## scraping-empik
Module used for scraping empik.pl ebooks i audiobooks.
Utilizing jsdom library to parse fetched HTML


* [scraping-empik](#module_scraping-empik)
    * [MAX_PAGES](#exp_module_scraping-empik--MAX_PAGES) ⏏
    * [setPageIndex(pageUrl, pageIndex)](#exp_module_scraping-empik--setPageIndex) ⇒ <code>string</code> ⏏
    * [isYesterdaysOffer(offer)](#exp_module_scraping-empik--isYesterdaysOffer) ⇒ <code>true</code> ⏏
    * [isTodaysOffer(offer)](#exp_module_scraping-empik--isTodaysOffer) ⇒ <code>true</code> ⏏
    * [enhanceSummary(summary)](#exp_module_scraping-empik--enhanceSummary) ⇒ <code>object</code> ⏏
    * [enhanceDetails(offer)](#exp_module_scraping-empik--enhanceDetails) ⇒ <code>object</code> ⏏
    * _async_
        * [getAvailablePagesNumber(scrapedUrl)](#exp_module_scraping-empik--getAvailablePagesNumber) ⇒ <code>Promise.&lt;number&gt;</code> ⏏
        * [getSummaries(pageUrl)](#exp_module_scraping-empik--getSummaries) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ⏏
        * [getDetails(pageUrl)](#exp_module_scraping-empik--getDetails) ⇒ <code>Promise.&lt;object&gt;</code> ⏏

<a name="exp_module_scraping-empik--MAX_PAGES"></a>

### MAX\_PAGES ⏏
Looks like Empik does not have any result page number limit

**Kind**: Exported constant  
<a name="exp_module_scraping-empik--setPageIndex"></a>

### setPageIndex(pageUrl, pageIndex) ⇒ <code>string</code> ⏏
Returns search result page url string from supplied page index

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | base url string |
| pageIndex | <code>number</code> \| <code>string</code> | url parameter |

<a name="exp_module_scraping-empik--isYesterdaysOffer"></a>

### isYesterdaysOffer(offer) ⇒ <code>true</code> ⏏
Checks if gumtree offer was added yesterday

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| offer | <code>object</code> | offer |

<a name="exp_module_scraping-empik--isTodaysOffer"></a>

### isTodaysOffer(offer) ⇒ <code>true</code> ⏏
Checks if gumtree offer was added today

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| offer | <code>object</code> | offer |

<a name="exp_module_scraping-empik--enhanceSummary"></a>

### enhanceSummary(summary) ⇒ <code>object</code> ⏏
Fix and add fields to fetched offer summary data

**Kind**: Exported function  
**Returns**: <code>object</code> - enhanced summary  

| Param | Type | Description |
| --- | --- | --- |
| summary | <code>object</code> | one offer summary |

<a name="exp_module_scraping-empik--enhanceDetails"></a>

### enhanceDetails(offer) ⇒ <code>object</code> ⏏
Fix and add fields to fetched offer details data\
Maps field categories like ['cat0', 'cat1'] into separate object fields like: cat.lev0: 'cat0'

**Kind**: Exported function  
**Returns**: <code>object</code> - enhanced details  

| Param | Type | Description |
| --- | --- | --- |
| offer | <code>object</code> | one offer details |

<a name="exp_module_scraping-empik--getAvailablePagesNumber"></a>

### getAvailablePagesNumber(scrapedUrl) ⇒ <code>Promise.&lt;number&gt;</code> ⏏
Returns search result page index from supplied url string

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;number&gt;</code> - last page index  
**Category**: async  

| Param | Type |
| --- | --- |
| scrapedUrl | <code>string</code> | 

<a name="exp_module_scraping-empik--getSummaries"></a>

### getSummaries(pageUrl) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ⏏
Fetch and scrape a page with offer summaries

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - offer summaries  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | offer summaries page url |

<a name="exp_module_scraping-empik--getDetails"></a>

### getDetails(pageUrl) ⇒ <code>Promise.&lt;object&gt;</code> ⏏
Fetch and scrape a page with offer details

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;object&gt;</code> - offer details  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | offer details page url |

<a name="module_scraping-gumtree"></a>

## scraping-gumtree
Module scraping gumtree.pl offers.
Utilizing jsdom library to parse fetched HTML


* [scraping-gumtree](#module_scraping-gumtree)
    * [MAX_PAGES](#exp_module_scraping-gumtree--MAX_PAGES) ⏏
    * [setPageIndex(pageUrl, pageIndex)](#exp_module_scraping-gumtree--setPageIndex) ⇒ <code>string</code> ⏏
    * [isYesterdaysOffer(offer)](#exp_module_scraping-gumtree--isYesterdaysOffer) ⇒ <code>boolean</code> ⏏
    * [isTodaysOffer(offer)](#exp_module_scraping-gumtree--isTodaysOffer) ⇒ <code>boolean</code> ⏏
    * [enhanceSummary(summary)](#exp_module_scraping-gumtree--enhanceSummary) ⇒ <code>object</code> ⏏
    * [enhanceDetails(detailedOffer)](#exp_module_scraping-gumtree--enhanceDetails) ⇒ <code>object</code> ⏏
    * _async_
        * [getAvailablePagesNumber(scrapedUrl)](#exp_module_scraping-gumtree--getAvailablePagesNumber) ⇒ <code>Promise.&lt;number&gt;</code> ⏏
        * [getSummaries(pageUrl)](#exp_module_scraping-gumtree--getSummaries) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ⏏
        * [getDetails(pageUrl)](#exp_module_scraping-gumtree--getDetails) ⇒ <code>Promise.&lt;object&gt;</code> ⏏

<a name="exp_module_scraping-gumtree--MAX_PAGES"></a>

### MAX\_PAGES ⏏
Gumtree currently returns 50 result pages at maximum

**Kind**: Exported constant  
<a name="exp_module_scraping-gumtree--setPageIndex"></a>

### setPageIndex(pageUrl, pageIndex) ⇒ <code>string</code> ⏏
Returns search result page url string from supplied page index

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | base url string |
| pageIndex | <code>number</code> \| <code>string</code> | url parameter |

<a name="exp_module_scraping-gumtree--isYesterdaysOffer"></a>

### isYesterdaysOffer(offer) ⇒ <code>boolean</code> ⏏
Checks if gumtree offer was added yesterday

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| offer | <code>object</code> | offer |

<a name="exp_module_scraping-gumtree--isTodaysOffer"></a>

### isTodaysOffer(offer) ⇒ <code>boolean</code> ⏏
Checks if gumtree offer was added today

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| offer | <code>object</code> | offer |

<a name="exp_module_scraping-gumtree--enhanceSummary"></a>

### enhanceSummary(summary) ⇒ <code>object</code> ⏏
Fix and add fields to fetched offer summary data

**Kind**: Exported function  
**Returns**: <code>object</code> - enhanced summary  

| Param | Type | Description |
| --- | --- | --- |
| summary | <code>object</code> | one offer summary |

<a name="exp_module_scraping-gumtree--enhanceDetails"></a>

### enhanceDetails(detailedOffer) ⇒ <code>object</code> ⏏
Fix and add fields to fetched offer details data

**Kind**: Exported function  
**Returns**: <code>object</code> - enhanced details  

| Param | Type | Description |
| --- | --- | --- |
| detailedOffer | <code>object</code> | one offer details |

<a name="exp_module_scraping-gumtree--getAvailablePagesNumber"></a>

### getAvailablePagesNumber(scrapedUrl) ⇒ <code>Promise.&lt;number&gt;</code> ⏏
Returns search result page index from supplied relative url string

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;number&gt;</code> - last page index  
**Category**: async  

| Param | Type |
| --- | --- |
| scrapedUrl | <code>string</code> | 

<a name="exp_module_scraping-gumtree--getSummaries"></a>

### getSummaries(pageUrl) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ⏏
Fetch and scrape a page with offer summaries

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - offer summaries  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | offer summaries page url |

<a name="exp_module_scraping-gumtree--getDetails"></a>

### getDetails(pageUrl) ⇒ <code>Promise.&lt;object&gt;</code> ⏏
Fetch and scrape a page with offer details

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;object&gt;</code> - offer details  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | offer details page url |

<a name="module_scraping-olx"></a>

## scraping-olx
Module scraping olx.pl offers (otodom.pl offers are posted here as well).
Utilizing puppetter library as simple parsing of html is not enough to meet the needs,
some data gets into html only after clicking some elements and getting another server response.


* [scraping-olx](#module_scraping-olx)
    * [MAX_PAGES](#exp_module_scraping-olx--MAX_PAGES) ⏏
    * [setPageIndex(pageUrl, pageIndex)](#exp_module_scraping-olx--setPageIndex) ⇒ <code>string</code> ⏏
    * [isYesterdaysOffer(offer)](#exp_module_scraping-olx--isYesterdaysOffer) ⇒ <code>boolean</code> ⏏
    * [isTodaysOffer(offer)](#exp_module_scraping-olx--isTodaysOffer) ⇒ <code>boolean</code> ⏏
    * [enhanceSummary(summary)](#exp_module_scraping-olx--enhanceSummary) ⇒ <code>object</code> ⏏
    * [enhanceDetails(detailedOffer)](#exp_module_scraping-olx--enhanceDetails) ⇒ <code>object</code> ⏏
    * _async_
        * [launchBrowser()](#exp_module_scraping-olx--launchBrowser) ⇒ <code>Promise.&lt;object&gt;</code> ⏏
        * [getBrowserTab(browser)](#exp_module_scraping-olx--getBrowserTab) ⇒ <code>Promise.&lt;object&gt;</code> ⏏
        * [getAvailablePagesNumber(pageUrl, browserTab)](#exp_module_scraping-olx--getAvailablePagesNumber) ⇒ <code>Promise.&lt;number&gt;</code> ⏏
        * [getSummaries(pageUrl, browserTab)](#exp_module_scraping-olx--getSummaries) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ⏏
        * [getDetails(pageUrl, browserTab)](#exp_module_scraping-olx--getDetails) ⇒ <code>Promise.&lt;object&gt;</code> ⏏

<a name="exp_module_scraping-olx--MAX_PAGES"></a>

### MAX\_PAGES ⏏
Olx currently returns 25 result pages at maximum

**Kind**: Exported constant  
<a name="exp_module_scraping-olx--setPageIndex"></a>

### setPageIndex(pageUrl, pageIndex) ⇒ <code>string</code> ⏏
Returns search result page url string with supplied page index

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | base url string |
| pageIndex | <code>number</code> \| <code>string</code> | url parameter |

<a name="exp_module_scraping-olx--isYesterdaysOffer"></a>

### isYesterdaysOffer(offer) ⇒ <code>boolean</code> ⏏
Checks if olx offer was added yesterday

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| offer | <code>object</code> | 

<a name="exp_module_scraping-olx--isTodaysOffer"></a>

### isTodaysOffer(offer) ⇒ <code>boolean</code> ⏏
Checks if olx offer was added today

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| offer | <code>object</code> | 

<a name="exp_module_scraping-olx--enhanceSummary"></a>

### enhanceSummary(summary) ⇒ <code>object</code> ⏏
Fix and add fields to fetched offer summary data

**Kind**: Exported function  
**Returns**: <code>object</code> - enhanced summary  

| Param | Type | Description |
| --- | --- | --- |
| summary | <code>object</code> | one offer summary |

<a name="exp_module_scraping-olx--enhanceDetails"></a>

### enhanceDetails(detailedOffer) ⇒ <code>object</code> ⏏
Fix and add fields to fetched offer details data

**Kind**: Exported function  
**Returns**: <code>object</code> - enhanced details  

| Param | Type | Description |
| --- | --- | --- |
| detailedOffer | <code>object</code> | one offer details |

<a name="exp_module_scraping-olx--launchBrowser"></a>

### launchBrowser() ⇒ <code>Promise.&lt;object&gt;</code> ⏏
Launches browser; retrieves puppeteer browser handle

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;object&gt;</code> - puppeteer browser handle  
**Category**: async  
<a name="exp_module_scraping-olx--getBrowserTab"></a>

### getBrowserTab(browser) ⇒ <code>Promise.&lt;object&gt;</code> ⏏
Retrieves puppeteer browser tab handle

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;object&gt;</code> - puppeteer browser tab handle  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| browser | <code>object</code> | puppeteer browser handle |

<a name="exp_module_scraping-olx--getAvailablePagesNumber"></a>

### getAvailablePagesNumber(pageUrl, browserTab) ⇒ <code>Promise.&lt;number&gt;</code> ⏏
Returns search result page index from supplied relative url string

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;number&gt;</code> - last page index  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> |  |
| browserTab | <code>object</code> | puppeteer browser tab handle |

<a name="exp_module_scraping-olx--getSummaries"></a>

### getSummaries(pageUrl, browserTab) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ⏏
Navigate to and scrape an olx page with offer summaries

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - offer summaries  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | offer summaries page url |
| browserTab | <code>object</code> | puppeteer browser tab handle |

<a name="exp_module_scraping-olx--getDetails"></a>

### getDetails(pageUrl, browserTab) ⇒ <code>Promise.&lt;object&gt;</code> ⏏
Determine whether link leads to olx or otodom page and execute proper scraping function

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;object&gt;</code> - offer details  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | offer details page url |
| browserTab | <code>object</code> | puppeteer browser tab handle |

<a name="module_scrapingShared"></a>

## scrapingShared
Module with functions shared by all specific website scraping modules


* [scrapingShared](#module_scrapingShared)
    * [toIsoDate(date)](#exp_module_scrapingShared--toIsoDate) ⇒ <code>string</code> ⏏
    * [rawPriceToNumber(rawPrice)](#exp_module_scrapingShared--rawPriceToNumber) ⇒ <code>number</code> ⏏
    * [castToNumber(str)](#exp_module_scrapingShared--castToNumber) ⇒ <code>number</code> \| <code>null</code> ⏏
    * _async_
        * [fetchPage(pageUrl)](#exp_module_scrapingShared--fetchPage) ⇒ <code>Promise.&lt;string&gt;</code> ⏏

<a name="exp_module_scrapingShared--toIsoDate"></a>

### toIsoDate(date) ⇒ <code>string</code> ⏏
**Kind**: Exported function  
**Returns**: <code>string</code> - date like 'YYYY-MM-DD'  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="exp_module_scrapingShared--rawPriceToNumber"></a>

### rawPriceToNumber(rawPrice) ⇒ <code>number</code> ⏏
**Kind**: Exported function  
**Returns**: <code>number</code> - price number like 50.21  

| Param | Type | Description |
| --- | --- | --- |
| rawPrice | <code>string</code> | price string like ' 50.21 zł ' |

<a name="exp_module_scrapingShared--castToNumber"></a>

### castToNumber(str) ⇒ <code>number</code> \| <code>null</code> ⏏
Converts string to number. If nullish value is supplied, return null.

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| str | <code>string</code> \| <code>null</code> | 

<a name="exp_module_scrapingShared--fetchPage"></a>

### fetchPage(pageUrl) ⇒ <code>Promise.&lt;string&gt;</code> ⏏
Fetches request html from supplied url

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;string&gt;</code> - request body  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| pageUrl | <code>string</code> | url to GET |

<a name="module_SendMail"></a>

## SendMail
Module utlizing nodemailer to send email notifications about new offers posted on watched (scraped) websites, as well as errors occuring in the process


* [SendMail](#module_SendMail)
    * [notifyAboutNewOffers(vars)](#exp_module_SendMail--notifyAboutNewOffers) ⏏
    * [notifyAboutError(err)](#exp_module_SendMail--notifyAboutError) ⏏

<a name="exp_module_SendMail--notifyAboutNewOffers"></a>

### notifyAboutNewOffers(vars) ⏏
Sends mail with notification about new offers.\
Recepients are specified in Config.MAIL_TO variable.\
Mail template is specified in Config.ERROR_MAIL_TEMPLATE variable.

**Kind**: Exported function  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| vars | <code>Object</code> | variables |

<a name="exp_module_SendMail--notifyAboutError"></a>

### notifyAboutError(err) ⏏
Sends mail with error notification.\
Recepients are specified in Config.MAIL_TO variable.\
Mail template is specified in Config.ERROR_MAIL_TEMPLATE variable.

**Kind**: Exported function  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>string</code> | error message |

<a name="module_shared"></a>

## shared
Module containing utility functions shared throughout the application


* [shared](#module_shared)
    * [getCurrTimestamp()](#exp_module_shared--getCurrTimestamp) ⇒ <code>string</code> ⏏
    * [addLogTs(logContent)](#exp_module_shared--addLogTs) ⇒ <code>string</code> ⏏
    * [consLog(logText)](#exp_module_shared--consLog) ⇒ <code>void</code> ⏏
    * [consError(errText)](#exp_module_shared--consError) ⇒ <code>void</code> ⏏
    * [createLogFilename(filenameSeed)](#exp_module_shared--createLogFilename) ⇒ <code>string</code> ⏏
    * [createLogFilepath(filenameEnding, origin)](#exp_module_shared--createLogFilepath) ⇒ <code>string</code> ⏏
    * [saveToJson(data, filepath)](#exp_module_shared--saveToJson) ⏏
    * _async_
        * [tryAndDo(attempt, onFailure)](#exp_module_shared--tryAndDo) ⇒ <code>Promise.&lt;(any\|void)&gt;</code> ⏏

<a name="exp_module_shared--getCurrTimestamp"></a>

### getCurrTimestamp() ⇒ <code>string</code> ⏏
Get current timestamp

**Kind**: Exported function  
**Returns**: <code>string</code> - current timestamp formatted like '[YYYY-MM-DD | hh:mi:ss]'  
<a name="exp_module_shared--addLogTs"></a>

### addLogTs(logContent) ⇒ <code>string</code> ⏏
Add timestamp prefix to a log text/error

**Kind**: Exported function  
**Returns**: <code>string</code> - log content with timestamp prefix  

| Param | Type | Description |
| --- | --- | --- |
| logContent | <code>string</code> | log content to print |

<a name="exp_module_shared--consLog"></a>

### consLog(logText) ⇒ <code>void</code> ⏏
Shorthand for console.logging a string with timestamp prefix

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| logText | <code>string</code> | log text to print |

<a name="exp_module_shared--consError"></a>

### consError(errText) ⇒ <code>void</code> ⏏
Shorthand for console.erroring a string with timestamp prefix

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| errText | <code>string</code> | error text to print |

<a name="exp_module_shared--createLogFilename"></a>

### createLogFilename(filenameSeed) ⇒ <code>string</code> ⏏
Generates log filename

**Kind**: Exported function  
**Returns**: <code>string</code> - log filename with timestamp like ${YYYY-MM-DD}-${timeInMs}-${filename}`  

| Param | Type |
| --- | --- |
| filenameSeed | <code>string</code> | 

<a name="exp_module_shared--createLogFilepath"></a>

### createLogFilepath(filenameEnding, origin) ⇒ <code>string</code> ⏏
Generates whole log filepath

**Kind**: Exported function  
**Returns**: <code>string</code> - filepath without extension in format [origin-filenameEnding] or [filenameEnding]  

| Param | Type | Description |
| --- | --- | --- |
| filenameEnding | <code>string</code> |  |
| origin | <code>string</code> | scraped origin website identifier |

<a name="exp_module_shared--saveToJson"></a>

### saveToJson(data, filepath) ⏏
**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | Currently accepts values: 'olx'/'gumtree' |
| filepath | <code>string</code> | without extension |

<a name="exp_module_shared--tryAndDo"></a>

### tryAndDo(attempt, onFailure) ⇒ <code>Promise.&lt;(any\|void)&gt;</code> ⏏
HOF returning result of an async function or calling onFailure callback in case of error

**Kind**: Exported function  
**Category**: async  

| Param | Type | Description |
| --- | --- | --- |
| attempt | <code>function</code> | callback to execute |
| onFailure | <code>function</code> | callback to execute in case of error |

