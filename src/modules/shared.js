/**
 * Module containing utility functions shared throughout the application
 * @module shared
 */

const fs = require('fs');
const { SAVE_LOGS, LOGS_PATH } = require('../Config');

/**
 * Get current timestamp
 * @alias module:shared
 * @return {string} current timestamp formatted like '[YYYY-MM-DD | hh:mi:ss]'
 */
const getCurrTimestamp = () => {
  const now = new Date();
  return `[${now.toISOString().substr(0, 10)}][${now
    .toTimeString()
    .substr(0, 8)}]`;
};

/**
 * Add timestamp prefix to a log text/error
 * @alias module:shared
 * @param {string} logContent log content to print
 * @return {string} log content with timestamp prefix
 */
const addLogTs = (logContent) => `${getCurrTimestamp()} ${logContent}`;

/**
 * Shorthand for console.logging a string with timestamp prefix
 * @alias module:shared
 * @param {string} logText log text to print
 * @return {void}
 */
const consLog = (logText) => {
  console.log(addLogTs(logText));
};

/**
 * Shorthand for console.erroring a string with timestamp prefix
 * @alias module:shared
 * @param {string} errText error text to print
 * @return {void}
 */
const consError = (errText) => {
  console.error(`%c${addLogTs(errText)}`, 'color: red');
};

/**
 * HOF returning result of an async function or calling onFailure callback in case of error
 * @category async
 * @alias module:shared
 * @param {function} attempt callback to execute
 * @param {function} onFailure callback to execute in case of error
 * @return {Promise<any|void>}
 */
async function tryAndDo(attempt, onFailure) {
  try {
    const res = await attempt();
    return res;
  } catch (err) {
    onFailure(err);
  }
}

/**
 * Generates log filename
 * @alias module:shared
 * @param {string} filenameSeed
 * @return {string} log filename with timestamp like ${YYYY-MM-DD}-${timeInMs}-${filename}`
 */
const createLogFilename = (filenameSeed) =>
  `${new Date()
    .toISOString()
    .substr(0, 10)}-${new Date().getTime()}-${filenameSeed}`;

/**
 * Generates whole log filepath
 * @alias module:shared
 * @param {string} filenameEnding
 * @param {string} origin scraped origin website identifier
 * @return {string} filepath without extension in format [origin-filenameEnding] or [filenameEnding]
 */
const createLogFilepath = (filenameEnding, origin) =>
  LOGS_PATH +
  createLogFilename(origin ? `${origin}-${filenameEnding}` : '' + filenameSeed);

/**
 * @alias module:shared
 * @param {string} data Currently accepts values: 'olx'/'gumtree'
 * @param {string} filepath without extension
 */
function saveToJson(data, filepath) {
  if (SAVE_LOGS) consLog(`Saving file: ${filepath}.json`);
  return fs.writeFileSync(`${filepath}.json`, JSON.stringify(data));
}

module.exports = {
  consLog,
  consError,
  tryAndDo,
  createLogFilename,
  createLogFilepath,
  saveToJson,
};
