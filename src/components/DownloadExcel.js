import React from 'react';
import * as XLSX from 'xlsx';

const DownloadExcel = ({ tableData, disabled }) => {
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

    return (
        <button className="generate-button" onClick={downloadExcel} disabled={disabled}>
            Download Excel
        </button>
    );
};

export default DownloadExcel;