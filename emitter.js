const io = require('socket.io-client');
const crypto = require('crypto');

const socket = io('http://localhost:3000'); 

const data = {
    names: [
        "Joanne Cassin",
        "Hector Kuphal",
        "Faye Rath Esq.",
        "Alphonso Kihn IV",
        "Amb. Lacy Wiza",
        "Marica Green",
        "Lise Conn III",
        "Sen. Bob Lubowitz",
        "Maria Schulist DDS",
        "Beulah Brekke",
        "Eliseo Cummerata",
        "Carri Donnelly",
        "Winfred Okuneva",
        "Son Wilderman",
        "Leonora Mueller",
        "Jonas Bahringer",
        "Florrie Nolan",
        "Katina Kunze I",
        "Jenae Becker",
        "Drew Nitzsche",
        "Chuck Windler IV",
        "Kenny Dickinson",
        "Herbert Abbott",
        "Kip Wilderman",
        "Krissy Zboncak",
        "Rep. Sang Weber",
        "Erline Kirlin IV",
        "Msgr. Clarence VonRueden",
        "Rev. Esperanza Klocko",
        "Althea Bashirian DC",
        "Fr. Kymberly Boyle",
        "Waldo Kuvalis",
        "Vince Schuster",
        "Mindi Johnson",
        "Wen Powlowski",
        "Mireille Lind",
        "Warner Sanford",
        "Msgr. Jayson Bahringer",
        "Amb. Luann Doyle",
        "Federico McLaughlin",
        "Lesli Homenick",
        "Msgr. Abraham Wilkinson",
        "Albert McGlynn",
        "Darell Ernser III",
        "Rep. Darryl Gutkowski",
        "Emery Windler",
        "Nu Reichert Ret.",
        "Pres. Keven Bartoletti",
        "Tam Grant",
        "Elsie Schmeler",
        "Victor Gusikowski",
        "Omar Botsford",
        "The Hon. Jessie Herzog",
        "Merry Klein",
        "Sen. Geraldo Kihn",
        "Refugio Prohaska",
        "Rev. Nguyet Wolff",
        "Rob Paucek",
        "Leanora Schneider",
        "Sandi Kerluke Ret.",
        "Israel Hagenes",
        "Augustus Bogan",
        "Ms. Lyman Jacobi",
        "Harland Ritchie",
        "Emogene Boyle",
        "Dr. Wm Jacobs",
        "Margot Jerde VM",
        "Laverna Rohan",
        "Josefa Reichert",
        "Darrel Collier",
        "Tosha Brekke",
        "Ralph Pfannerstill",
        "Santana Doyle",
        "Mrs. Bret Johnson",
        "Alene Lemke",
        "Clinton Ledner",
        "Darcel Kassulke",
        "Jeni Wolff",
        "Lakia Moen",
        "Gerri Sipes",
        "Miss Chantel Brekke",
        "Kia Kiehn",
        "Ruben Rolfson I",
        "Glenn Rowe",
        "Walter Swaniawski II",
        "Santos Predovic",
        "Nova Bernhard",
        "Eleanore Oberbrunner",
        "Sonia Zboncak",
        "Elvis Hirthe Esq.",
        "Valencia Greenfelder JD",
        "Rene Beier",
        "Gov. Loralee Farrell",
        "Asa Jast",
        "Rev. Newton Cummerata",
        "Jon Wisozk",
        "Tom Hane",
        "Hanh Bode",
        "Mose Feeney",
        "Ashli Bartoletti"
    ],
    cities: [
        "Donteview",
        "Lake Frederick",
        "Russelville",
        "Pollichfurt",
        "Marksberg",
        "Shenaberg",
        "East Codi",
        "Heathcoteberg",
        "South Russburgh",
        "Lake Barrie",
        "East Deon",
        "Angleaside",
        "East Cornell",
        "North Thurman",
        "Conceptionland",
        "Homenickside",
        "New Richardmouth",
        "Marcelinoland",
        "West Noelburgh",
        "Lake Rachellview",
        "Naderville",
        "South Devin",
        "Kingfurt",
        "West Kanesha",
        "Russelfort",
        "Lake Patrick",
        "Lake Novella",
        "Juliushaven",
        "Kilbackfurt",
        "Murphychester",
        "West Evantown",
        "West Filomenaton",
        "Wunschland",
        "East Robbie",
        "Chrisfurt",
        "East Sharmaineland",
        "Fadelmouth",
        "West Lourdes",
        "New Demetra",
        "North Long",
        "Gerholdhaven",
        "New Wade",
        "Metzmouth",
        "South Emmett",
        "New Leighburgh",
        "East Chanaburgh",
        "East Caridadburgh",
        "East Chelsiefort",
        "Lake Mauricioborough",
        "Gerardofort",
        "West Marquis",
        "North Tommie",
        "Bobetteview",
        "New Ursulashire",
        "South Lorriane",
        "West Stanstad",
        "Port Maxiebury",
        "Lueilwitzfort",
        "Lake Florinda",
        "Efrainview",
        "New Jorge",
        "Prosaccoview",
        "Osvaldoside",
        "Judsonville",
        "Paristown",
        "Francescotown",
        "Hilllshire",
        "Tamieville",
        "Shirelyfort",
        "Douglasstad",
        "West Wm",
        "North Beverlee",
        "Manfurt",
        "West Leighaville",
        "Bobbybury",
        "South Ginatown",
        "Philomenaview",
        "Lake Junie",
        "Stewartstad",
        "West Malcomberg",
        "Lake Vicente",
        "Litteltown",
        "East Christalberg",
        "West Orenfurt",
        "Chadwickbury",
        "New Zola",
        "West Carol",
        "Kihnberg",
        "South Elmerton",
        "New Elmer",
        "Port Emileburgh",
        "North Charis",
        "Marksside",
        "Guybury",
        "Port Allyson",
        "North Jinaville",
        "Lake Colemanmouth",
        "New Yongside",
        "Port Rosette",
        "Abernathyborough"
    ],
};

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function generateRandomData() {
    const name = getRandomElement(data.names);
    const origin = getRandomElement(data.cities);
    const destination = getRandomElement(data.cities);

    const secretKey = crypto.createHash('sha256').update(`${name}${origin}${destination}`).digest('hex');

    return {
        name,
        origin,
        destination,
        secretKey,
    };
}

const algorithm = 'aes-256-ctr';
const secretKey = crypto.createHash('sha256').update('encript').digest('hex'); // Fixed the variable name to secretKey
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey,'hex'), iv); // Use secretKey with the correct case
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function generateEncryptedMessage() {
    const numMessages = Math.floor(Math.random() * (499 - 49 + 1)) + 49;

    for (let i = 0; i < numMessages; i++) {
        const message = generateRandomData();
        const encryptedMessage = encrypt(JSON.stringify(message));
        socket.emit('incomingData', encryptedMessage);
    }
}


// Connect to the server
socket.on('connect', () => {
    console.log('Connected to server');
    generateEncryptedMessage();

    // Generate and emit encrypted data periodically
    setInterval(() => {
        generateEncryptedMessage();
    }, 10000); // Adjust the interval as needed
});

// Handle disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
