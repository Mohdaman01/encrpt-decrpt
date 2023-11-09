const http = require('http');
const socketIO = require('socket.io');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/timeseriesdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a MongoDB schema and model
const timeseriesSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  name: String,
  origin: String,
  destination: String,
  secretKey: String,
});

const TimeseriesModel = mongoose.model('Timeseries', timeseriesSchema);

const server = http.createServer();
const io = socketIO(server);

// Encryption and decryption functions
const algorithm = 'aes-256-ctr';
const secretKey = 'your-secret-key';
const iv = crypto.randomBytes(16);

function decrypt(text) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(text, 'hex')), decipher.final()]);
  return decrypted.toString();
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Emitter connected');

  // Listen for incoming encrypted data stream
  socket.on('incomingData', (encryptedData) => {
    try {
      // Decrypt the data
      const decryptedData = decrypt(encryptedData);
      const parsedData = JSON.parse(decryptedData);

      // Validate data integrity using secret_key
      const { name, origin, destination, secretKey } = parsedData;
      const calculatedSecretKey = crypto.createHash('sha256').update(`${name}${origin}${destination}`).digest('hex');

      if (secretKey !== calculatedSecretKey) {
        console.error('Data integrity compromised. Discarding operation.');
        return;
      }

      // Add timestamp and save to MongoDB
      const timeseriesData = new TimeseriesModel(parsedData);
      timeseriesData.save((err) => {
        if (err) {
          console.error('Error saving to MongoDB:', err);
        } else {
          console.log('Data saved successfully.');
        }
      });
    } catch (error) {
      console.error('Error processing incoming data:', error);
    }
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Emitter disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Listener is running on port ${PORT}`);
});
