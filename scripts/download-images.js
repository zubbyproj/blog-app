const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    filename: 'nextjs-post.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=400&fit=crop',
    filename: 'tailwind-post.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    filename: 'typescript-post.jpg'
  }
];

const imagesDir = path.join(process.cwd(), 'public', 'images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download images
images.forEach(({ url, filename }) => {
  const filepath = path.join(imagesDir, filename);
  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(filepath);
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      console.log(`Downloaded: ${filename}`);
    });
  });
}); 