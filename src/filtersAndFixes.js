/**
 * Module with additional filtering and fixing data functions defined for specific business logic
 * @module filtersAndFixes
 */

const isInWarsaw = (offer) => offer.city === 'Warszawa';
const isNewerThan2k = (offer) => !offer.buildYear || +offer.buildYear >= 2000;
const isNotInWeakDistrict = (offer) =>
  !offer.district ||
  ![
    'rembertów',
    'białołęka',
    'ursus',
    'bemowo',
    'ochota',
    'włochy',
    'wesoła',
    'wawer',
    'wilanów',
  ].includes(offer.district.toLowerCase().trim());
const isNotExpensive = (offer) =>
  !offer.pricem2 ||
  Number.isNaN(parseFloat(offer.pricem2)) ||
  parseFloat(offer.pricem2) <= 13000;
const isNotTooCheap = (offer) =>
  !offer.price ||
  Number.isNaN(parseFloat(offer.price)) ||
  parseFloat(offer.price) >= 300000;
const isNotTrimoProSpam = (offer) =>
  !offer.sellerName || offer.sellerName !== 'Biuro nieruchomości';

function addPricem2(offer) {
  if (!offer.price || !offer.area) return offer;
  return { ...offer, pricem2: Math.round(offer.price / offer.area) };
}

// remove raw data (key property starting with 'raw')
function rawDataOut(offer) {
  return Object.entries(offer).reduce((withoutRawData, [key, val]) => {
    if (key.substr(0, 3) === 'raw') return withoutRawData;
    return { ...withoutRawData, [key]: val };
  }, {});
}

/**
 * Checks if offer fulfills business requirements specified in private methods in this module
 * @alias module:filtersAndFixes
 * @param {object} offer
 * @return {bool}
 */
function filterDataRows(offer) {
  return (
    isInWarsaw(offer) &&
    isNewerThan2k(offer) &&
    isNotInWeakDistrict(offer) &&
    isNotExpensive(offer) &&
    isNotTooCheap(offer) &&
    isNotTrimoProSpam(offer)
  );
}

/**
 * Add columns added by private methods in this module
 * @alias module:filtersAndFixes
 * @param {Array<object>} offers
 * @return {Array<object>}
 */
function addCalculationColumns(offers) {
  return offers.map(addPricem2);
}

/**
 * Remove data that is not supposed to get saved to excel
 * @alias module:filtersAndFixes
 * @param {object} offer
 * @return {object} offer without chosen data fields
 */
function deleteChosenCols(offer) {
  return rawDataOut(offer);
}

module.exports = {
  filterDataRows,
  addCalculationColumns,
  deleteChosenCols,
};
