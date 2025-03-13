import React from 'react';

const Table = ({ data }) => (
    <table>
        <thead>
            <tr>
                <th>Chiave</th>
                <th>Italiano</th>
                <th>Inglese</th>
            </tr>
        </thead>
        <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                    <td>{row.key}</td>
                    <td>{row.italian}</td>
                    <td>{row.english}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default Table;