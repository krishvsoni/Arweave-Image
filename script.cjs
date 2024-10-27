const Arweave = require('arweave');
const fs = require('fs');
const path = require('path');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

const walletKey = JSON.parse(fs.readFileSync('your-wallet-file.json', 'utf8'));

async function uploadImage(imagePath) {
  try {
    const imageData = fs.readFileSync(imagePath);

    let transaction = await arweave.createTransaction({
      data: imageData,
    }, walletKey);

    transaction.addTag('Content-Type', 'image/jpeg');

    await arweave.transactions.sign(transaction, walletKey);

    let response = await arweave.transactions.post(transaction);
    
    if (response.status === 200) {
      console.log('Image uploaded successfully! Transaction ID:', transaction.id);
      console.log(`View your image at https://arweave.net/${transaction.id}`);
    } else {
      console.error('Failed to upload image:', response);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

const imagePath = path.join(__dirname, 'your-image-path');
uploadImage(imagePath);
