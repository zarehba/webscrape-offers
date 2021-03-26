/**
 * Module utilizing exceljs to append new scraped offers data to .xslx *database*
 * @module Excel
 */

const Exceljs = require('exceljs');
const { consLog, consError } = require('../shared');
const { SAVE_LOGS, EXCEL_HEADER } = require('../../Config');
const LINKS_COLS = Object.entries(EXCEL_HEADER).reduce(
  (linkCols, [sheetName, headerColumns]) => ({
    ...linkCols,
    [sheetName]: calcLinkColNumbers(headerColumns),
  }),
  {}
);

/**
 * Returns indexes of header columns with type hyperlink
 * @private
 * @param {object} headerColumns header from config.js
 * @return {Array<number>} indexes of hyperlink columns in a header
 */
function calcLinkColNumbers(headerColumns) {
  return headerColumns
    .map((col, index) => (col.header.includes('[link]') ? index + 1 : null))
    .filter(Boolean);
}

/**
 * Shortens supplied url to a friendly look
 * @private
 * @param {string} link url to shorten
 * @return {string} domain name
 */
function generateHyperlinkText(link) {
  if (link.includes('jpg') || link.includes('image')) {
    return 'obrazek';
  }
  return new URL(link).host.replace('www.', '');
}

/**
 * Function turns supplied cell object into a link
 * @private
 * @param {Array<object>} data offer details data
 * @param {object} modifiedCell eceljs cell object
 * @param {string} currVal current text in cell
 */
function turnCellIntoLink(modifiedCell, currVal) {
  modifiedCell.value = {
    text: generateHyperlinkText(currVal),
    hyperlink: currVal,
    tooltip: currVal,
  };
  modifiedCell.alignment = {
    horizontal: 'center',
  };
  modifiedCell.font = { name: 'Calibri', color: { argb: '000000BB' } };
}

/**
 * Reads .xslx file, appends new data after header and fixes hyperlinks in newly added data
 * @category async
 * @alias module:Excel
 * @param {Array<object>} data offer details data
 * @param {string} filepath
 * @param {string} worksheetName
 * @return {Promise<void>}
 */
module.exports = async function Excel(data, filepath, worksheetName) {
  if (!data.length) return;

  const workbook = new Exceljs.Workbook();
  await workbook.xlsx.readFile(filepath);
  const worksheet = workbook.getWorksheet(worksheetName);

  // add keys to header in excel to allow inserting data from json
  EXCEL_HEADER.details.forEach((col, index) => {
    worksheet.getColumn(index + 1).key = col.key;
  });

  worksheet.spliceRows(2, 0, ...data);

  for (let lastRow = 1 + data.length, i = 2; i <= lastRow; i++) {
    LINKS_COLS.details.forEach((colIndex) => {
      const modifiedCell = worksheet.getRow(i).getCell(colIndex);
      const currVal = modifiedCell.value;
      if (typeof currVal === 'Object') return;
      if (currVal) turnCellIntoLink(modifiedCell, currVal);
    });
  }

  await workbook.xlsx
    .writeFile(filepath)
    .then(() => {
      if (SAVE_LOGS) consLog(`Saved file: ${filepath}`);
    })
    .catch((err) =>
      consError(`There was en error saving file: ${filepath}:\n${err}`)
    );
};
