'use strict';

const R = require('ramda');

const selectFieldsAndMerge = fields =>
  R.reduce((acc, item) => {
    return R.compose(R.mergeDeepRight(acc), R.pick(fields))(item);
  }, {});

module.exports = selectFieldsAndMerge;
