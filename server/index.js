import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FixTrail Smart IT Solver API',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Diagnostic endpoint
app.post('/api/diagnose', (req, res) => {
  const { description, extractedText, categoryHint } = req.body;
  // Fallback endpoint if client queries server API directly
  res.json({
    success: true,
    message: 'Diagnostic processed successfully'
  });
});

// Serve frontend build if dist exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`FixTrail server running on http://localhost:${PORT}`);
});
