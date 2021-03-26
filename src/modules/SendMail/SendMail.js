/**
 * Module utlizing nodemailer to send email notifications about new offers posted on watched (scraped) websites, as well as errors occuring in the process
 * @module SendMail
 */

const nodemailer = require('nodemailer');
const { consLog, consError } = require('../shared');
const {
  SAVE_LOGS,
  MAIL_CONNECTION,
  MAIL_FROM,
  MAIL_TO,
  SEND_MAIL,
  MAIL_TEMPLATE,
  ERROR_MAIL_TEMPLATE,
} = require('../../Config');

/**
 * Extracts SMTP response code from response
 * @param {object} res SMTP response
 * @return {string} response code
 */
function extractResponseCode(res) {
  if (!res.response) return '';
  return res.response.split(' ')[0];
}

/**
 * Sends contents by mail to recepients specified in MAIL_TO configuration variable
 * @category async
 * @param {string} contents
 */
async function SendMail(contents) {
  const transporter = nodemailer.createTransport(MAIL_CONNECTION);

  for (const mailRecipient of MAIL_TO) {
    try {
      const res = await transporter.sendMail({
        from: MAIL_FROM,
        to: mailRecipient,
        ...contents,
      });
      consLog(
        `Mail to ${mailRecipient} was sent successfully (${extractResponseCode(
          res
        )})`
      );
    } catch (err) {
      consError(`There was an error sending mail to ${mailRecipient}:\n${err}`);
    }
  }
}

/**
 * Subtitutes variables inside mail template
 * @category async
 * @param {{subject: string, html: string}} mailTemplate
 * @param {{var1: string|number, varN: string|number}} vars variables
 * @return {{subject: string, html: string}} mail contents with substituted variables
 */
function insertMailVariables(mailTemplate, vars) {
  const reduceString = (outputStr, [key, val]) =>
    outputStr.replace('${' + key + '}', val);
  return {
    subject: Object.entries(vars).reduce(reduceString, mailTemplate.subject),
    html: Object.entries(vars).reduce(reduceString, mailTemplate.html),
  };
}

/**
 * Sends mail with notification about new offers.\
 * Recepients are specified in Config.MAIL_TO variable.\
 * Mail template is specified in Config.ERROR_MAIL_TEMPLATE variable.
 * @category async
 * @alias module:SendMail
 * @param {{var1: string|number, varN: string|number}} vars variables
 */
async function notifyAboutNewOffers(vars) {
  if (SAVE_LOGS) consLog('Sending mail notification about new offers');
  const mailContent = insertMailVariables(MAIL_TEMPLATE, vars);
  SendMail(mailContent);
}

/**
 * Sends mail with error notification.\
 * Recepients are specified in Config.MAIL_TO variable.\
 * Mail template is specified in Config.ERROR_MAIL_TEMPLATE variable.
 * @category async
 * @alias module:SendMail
 * @param {string} err error message
 */
async function notifyAboutError(err) {
  if (SEND_MAIL) {
    if (SAVE_LOGS) {
      consLog('Sending mail with error info');
    }
    const mailContent = insertMailVariables(ERROR_MAIL_TEMPLATE, {
      errorMsg: err,
    });
    SendMail(mailContent);
  }
}

module.exports = {
  notifyAboutNewOffers,
  notifyAboutError,
};
