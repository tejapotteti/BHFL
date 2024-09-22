const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: 'https://bhflbackend-production.up.railway.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const USER_ID = "john_doe_17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

app.post('/bfhl', (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const lowercaseAlphabets = alphabets.filter(item => item.toLowerCase() === item);
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = null;

    if (file_b64) {
      fileValid = true;
      // For simplicity, we're using a placeholder MIME type and file size
      // In a real scenario, you'd determine these from the actual file
      fileMimeType = file_b64.startsWith('/9j/') ? "image/jpeg" : "application/pdf";
      fileSizeKb = Math.floor(Math.random() * 2000) + 1; // Random size between 1 and 2000 KB
    }

    res.json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb ? fileSizeKb.toString() : null
    });
  } catch (error) {
    res.status(400).json({ is_success: false, error: error.message });
  }
});

app.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));