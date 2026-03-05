const express = require('express');
const router = express.Router();
const { ingestCandidate, getAllCandidates, getCandidateById, intakeCandidate, performCVAnalysis } = require('../controllers/candidateController');

router.post('/ingest', ingestCandidate);
router.post('/:id/ingest', ingestCandidate);
router.post('/intake', intakeCandidate);
router.post('/:id/analyze', performCVAnalysis);
router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);

module.exports = router;
