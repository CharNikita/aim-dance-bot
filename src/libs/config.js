require('dotenv').config();

module.exports = {
  get(variable) {
    return process.env[variable];
  },
};
