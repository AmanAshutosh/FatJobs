'use strict';

const multer = require('multer');
const pdfParse = require('pdf-parse');
const { analyzeResume } = require('../services/resumeAnalyzerService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') cb(null, true);
    else cb(new Error('Only PDF or TXT files are supported'));
  }
});

// POST /api/resume/analyze — JSON body
const analyze = async (req, res) => {
  try {
    const { resume_text, target_role, experience_level, job_description } = req.body;

    if (!resume_text || resume_text.trim().length < 50) {
      return res.status(400).json({ error: 'Invalid or empty resume. Please provide at least 50 characters of resume text.' });
    }

    const result = analyzeResume(
      resume_text.trim(),
      target_role || 'SDE',
      experience_level || 'Fresher',
      job_description || ''
    );

    res.json(result);
  } catch (err) {
    console.error('[RESUME] Analysis error:', err.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
};

// POST /api/resume/parse-pdf — multipart/form-data with 'pdf' field
const parsePDF = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

      let text = '';
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(req.file.buffer);
        text = data.text;
      } else {
        text = req.file.buffer.toString('utf-8');
      }

      if (!text || text.trim().length < 30) {
        return res.status(400).json({ error: 'Could not extract text from the file. Try copying and pasting your resume text instead.' });
      }

      res.json({ text: text.trim(), pages: req.file.mimetype === 'application/pdf' ? undefined : 1 });
    } catch (err) {
      console.error('[RESUME] PDF parse error:', err.message);
      res.status(500).json({ error: 'PDF parsing failed. Try pasting your resume text directly instead.' });
    }
  }
];

module.exports = { analyze, parsePDF };
