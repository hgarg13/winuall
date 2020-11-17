const express = require('express');
const router = express.Router();
const git = require('../github');

router.get('/', git.getFollowersData);

module.exports = router;