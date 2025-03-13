import React from 'react';

const DownloadHtml = ({ tableData, disabled }) => {
    const downloadHtml = () => {
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
        <button className="generate-button" onClick={downloadHtml} disabled={disabled}>
            Download HTML
        </button>
    );
};

export default DownloadHtml;