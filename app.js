const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sync database
db.sequelize.sync()
    .then(() => {
        console.log("Database synced successfully.");
    })
    .catch((err) => {
        console.error("Failed to sync database: " + err.message);
    });

// Import routes
const invoiceRoutes = require('./routes/invoice');
app.use('/api/invoice', invoiceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}.`);
});
