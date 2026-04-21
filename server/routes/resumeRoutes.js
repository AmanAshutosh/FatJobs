'use strict';

const express = require('express');
const { analyze, parsePDF } = require('../controllers/resumeController');

const router = express.Router();

router.post('/analyze', analyze);
router.post('/parse-pdf', parsePDF);

module.exports = router;
