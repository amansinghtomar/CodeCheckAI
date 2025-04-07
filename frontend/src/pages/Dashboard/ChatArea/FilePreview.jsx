import React from "react";
import { FileIcon, X } from "lucide-react";

const FilePreview = ({ file, onRemove }) => (
   <div className="file-preview">
      <div className="file-icon">
         <FileIcon />
      </div>
      <div className="file-info">
         <div className="file-name">{file.name}</div>
         <div className="file-type">{file.type?.split("/")[1]?.toUpperCase() || "FILE"}</div>
      </div>
      <div className="file-remove" onClick={onRemove}>
         <X />
      </div>
   </div>
);

export default FilePreview;
