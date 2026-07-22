const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const saveBase64Image = (base64String, req) => {
  if (!base64String || !base64String.startsWith('data:image')) {
    return base64String; // Return as is if it's already a URL or not base64
  }
  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64String;
    }
    const ext = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
    // Path resolves to Backend/uploads
    const uploadPath = path.join(__dirname, '../../uploads', filename);
    fs.writeFileSync(uploadPath, buffer);
    const host = req.get('host');
    const protocol = req.protocol;
    return `${protocol}://${host}/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    return null;
  }
};

module.exports = { saveBase64Image };
