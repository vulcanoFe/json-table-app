import React, { useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';

function App() {
    const [json1, setJson1] = useState(null);
    const [json2, setJson2] = useState(null);
    const [fileName1, setFileName1] = useState('');
    const [fileName2, setFileName2] = useState('');
    const [tableData, setTableData] = useState([]);

    const handleFileUpload = (e, setJson, setFileName) => {
        const file = e.target.files[0];
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            setJson(JSON.parse(event.target.result));
        };
        reader.readAsText(file);
    };

    const flattenObject = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, key) => {
            const value = obj[key];
            const prefixedKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null) {
                Object.assign(acc, flattenObject(value, prefixedKey));
            } else {
                acc[prefixedKey] = value;
            }
            return acc;
        }, {});
    };

    const generateTableData = () => {
        if (json1 && json2) {
            const flatJson1 = flattenObject(json1);
            const flatJson2 = flattenObject(json2);
            const keys = new Set([...Object.keys(flatJson1), ...Object.keys(flatJson2)]);
            const data = Array.from(keys).map((key) => ({
                key,
                italian: flatJson1[key] || 'Valore non disponibile',
                english: flatJson2[key] || 'Valore non disponibile',
            }));
            setTableData(data);
        }
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();

        // Aggiungi stili alle celle
        const headerStyle = {
            fill: { fgColor: { rgb: 'FFCCCCCC' } },
            font: { bold: true },
        };
        const alternateRowStyle = {
            fill: { fgColor: { rgb: 'FFEEEEEE' } },
        };

        // Applica stili alle intestazioni
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: C });
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = headerStyle;
        }

        // Applica stili alle righe alternate
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!worksheet[cellAddress]) continue;
                if (R % 2 === 0) {
                    worksheet[cellAddress].s = alternateRowStyle;
                }
            }
        }

        // Imposta la larghezza delle colonne
        const colWidths = tableData.reduce((acc, row) => {
            Object.keys(row).forEach((key, index) => {
                const value = row[key];
                const length = value ? value.toString().length : 10;
                acc[index] = Math.max(acc[index] || 10, length);
            });
            return acc;
        }, []);
        worksheet['!cols'] = colWidths.map((width) => ({ wch: width }));

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabella');
        XLSX.writeFile(workbook, 'tabella.xlsx');
    };

    const downloadHTML = () => {
        const cssStyles = `
      <style>
        .App {
          font-family: 'Arial', sans-serif;
          text-align: center;
          padding: 20px;
        }
        table {
          width: 80%;
          margin: 20px auto;
          border-collapse: collapse;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        th, td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
          color: #333;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
      </style>
    `;

        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tabella JSON</title>
        ${cssStyles}
      </head>
      <body>
        <div class="App">
          <table>
            <thead>
              <tr>
                <th>Chiave</th>
                <th>Italiano</th>
                <th>Inglese</th>
              </tr>
            </thead>
            <tbody>
              ${tableData.map(row => `
                <tr>
                  <td>${row.key}</td>
                  <td>${row.italian}</td>
                  <td>${row.english}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'tabella.html';
        link.click();
    };

    return (
        <div className="App">
            <h1>Carica i file JSON</h1>
            <div className="file-upload-container">
                <label className="custom-file-upload">
                    <input type="file" onChange={(e) => handleFileUpload(e, setJson1, setFileName1)} />
                    Scegli file Italiano
                </label>
                <span className="file-name">{fileName1}</span>
                <label className="custom-file-upload">
                    <input type="file" onChange={(e) => handleFileUpload(e, setJson2, setFileName2)} />
                    Scegli file Inglese
                </label>
                <span className="file-name">{fileName2}</span>
                <button className="generate-button" onClick={generateTableData}>Genera Tabella</button>
                <button className="generate-button" onClick={downloadExcel}>Download Excel</button>
                <button className="generate-button" onClick={downloadHTML}>Download HTML</button>
            </div>
            {tableData.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Chiave</th>
                            <th>Italiano</th>
                            <th>Inglese</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.key}</td>
                                <td>{row.italian}</td>
                                <td>{row.english}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;