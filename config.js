
require('dotenv').config();
const env = process.env.NODE_ENV;
const credentials = require(`./.credentials.${env}`);
console.log(credentials);
module.exports = {credentials};
