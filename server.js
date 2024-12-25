const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Path to the Excel file
const filePath = 'expenses.xlsx';

// Function to read the Excel file
const readExcelFile = () => {
    if (!fs.existsSync(filePath)) {
        // Create an empty workbook if it doesn't exist
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
        XLSX.writeFile(workbook, filePath);
    }
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

// Function to write data to the Excel file
const writeExcelFile = (data) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    XLSX.writeFile(workbook, filePath);
};

// Endpoint to get expenses
app.get('/expenses', (req, res) => {
    const data = readExcelFile();
    res.json(data);
});

// Endpoint to add an expense
app.post('/expenses', (req, res) => {
    const newExpense = req.body;
    const data = readExcelFile();
    data.push(newExpense);
    writeExcelFile(data);
    res.status(201).json({ message: 'Expense added!' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
