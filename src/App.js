import React, { useState } from 'react';
import './App.css';

function App() {
    const [json1, setJson1] = useState(null);
    const [json2, setJson2] = useState(null);
    const [tableData, setTableData] = useState([]);

    const handleFileUpload = (e, setJson) => {
        const file = e.target.files[0];
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

    return (
        <div className="App">
            <h1>Carica i file JSON</h1>
            <input type="file" onChange={(e) => handleFileUpload(e, setJson1)} />
            <input type="file" onChange={(e) => handleFileUpload(e, setJson2)} />
            <button onClick={generateTableData}>Genera Tabella</button>
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