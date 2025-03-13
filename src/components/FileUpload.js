import React from 'react';

const FileUpload = ({ label, onChange, fileName }) => (
    <div className="file-upload-container">
        <label className="custom-file-upload">
            <input type="file" onChange={onChange} />
            {label}
        </label>
        <span className="file-name">{fileName}</span>
    </div>
);

export default FileUpload;