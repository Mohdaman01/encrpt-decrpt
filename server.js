const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const crypto = require('crypto');
const db = require('./config/mongoose');
const TimeseriesModel = require('./models/timeSeriesSchema');
const emitter = require('./emitter');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Encryption and decryption functions 
const algorithm = 'aes-256-ctr';
const secretKey = crypto.createHash('sha256').update('encript').digest('hex');
// const iv = crypto.randomBytes(16);


function decrypt(text, iv) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(text, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for incoming encrypted data stream
    socket.on('incomingData', ({encryptedData, iv}) => {
        try {
            // Decrypt the data
            const decryptedData = decrypt(encryptedData, iv);
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
            timeseriesData.save();

            // Emit saved data to frontend
            io.emit('savedData', decryptedData);

        } catch (error) {
            console.error('Error processing incoming data:', error);
        }
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
