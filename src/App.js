import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import Table from './components/Table';
import DownloadExcel from './components/DownloadExcel';
import DownloadHTML from './components/DownloadHtml';

function App() {
    const [json1, setJson1] = useState(null);
    const [json2, setJson2] = useState(null);
    const [fileName1, setFileName1] = useState('');
    const [fileName2, setFileName2] = useState('');
    const [tableData, setTableData] = useState([]);
    const [isTableGenerated, setIsTableGenerated] = useState(false);

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
            setIsTableGenerated(true);
        }
    };

    return (
        <div className="App">
            <h1>Carica i file JSON</h1>
            <div className="file-upload-container">
                <FileUpload
                    label="Scegli file Italiano"
                    onChange={(e) => handleFileUpload(e, setJson1, setFileName1)}
                    fileName={fileName1}
                />
                <FileUpload
                    label="Scegli file Inglese"
                    onChange={(e) => handleFileUpload(e, setJson2, setFileName2)}
                    fileName={fileName2}
                />
            </div>
            <div className="button-container">
                <button
                    className="generate-button"
                    onClick={generateTableData}
                    disabled={!json1 || !json2}
                >
                    Genera Tabella
                </button>
                <DownloadExcel tableData={tableData} disabled={!isTableGenerated} />
                <DownloadHTML tableData={tableData} disabled={!isTableGenerated} />
            </div>
            {tableData.length > 0 && <Table data={tableData} />}
        </div>
    );
}

export default App;