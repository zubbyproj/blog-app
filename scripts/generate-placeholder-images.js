const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const contentDir = path.join(process.cwd(), 'src/content');
const imagesDir = path.join(process.cwd(), 'public/images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Get all markdown files
const markdownFiles = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md'));

// Generate placeholder images for each post
markdownFiles.forEach(file => {
  const slug = file.replace('.md', '').toLowerCase().replace(/ /g, '-');
  const imagePath = path.join(imagesDir, `${slug}.jpg`);
  
  // Skip if image already exists
  if (fs.existsSync(imagePath)) {
    return;
  }

  // Create a canvas for the placeholder image
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(slug.replace(/-/g, ' '), width / 2, height / 2);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(imagePath, buffer);
  
  console.log(`Generated placeholder image for ${slug}`);
});

console.log('Finished generating placeholder images'); 