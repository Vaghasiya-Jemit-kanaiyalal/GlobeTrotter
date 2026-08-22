const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

function generateSlug(text) {
  const base = slugify(text || 'trip', {
    lower: true,
    strict: true,
    trim: true
  });
  const shortId = uuidv4().substring(0, 6);
  return `${base}-${shortId}`;
}

module.exports = {
  generateSlug
};
