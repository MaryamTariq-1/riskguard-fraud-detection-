const express = require('express');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const app = express();
const PORT = 3000;

// 1. Frontend files ko serve karne ke liye (public folder)
app.use(express.static('public'));

// 2. API Endpoint jo CSV data read karke JSON mein bhejega
app.get('/api/risks', (req, res) => {
    try {
        // CSV file ka exact path
        const csvPath = path.join(__dirname, 'data', 'return_abusers_risk_list.csv');
        
        // Check karein ke file exist karti hai ya nahi
        if (!fs.existsSync(csvPath)) {
            return res.status(404).json({ success: false, error: 'CSV file not found. Please run generate-data.js first.' });
        }

        // File read karein
        const fileContent = fs.readFileSync(csvPath, 'utf8');
        
        // csv-parse library se CSV ko JSON array mein convert karein
        const records = parse(fileContent, { 
            columns: true, 
            skip_empty_lines: true 
        });
        
        // Frontend ko successful response bhejein
        res.json({ success: true, total_records: records.length, data: records });
        
    } catch (error) {
        console.error("Error reading CSV:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// 3. Server Start karein
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Backend Server is running!`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/risks`);
    console.log(`=========================================`);
});