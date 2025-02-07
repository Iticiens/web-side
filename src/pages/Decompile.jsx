import { InboxOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { message, Upload, Button } from "antd";
import { useState } from "react";
import "../Components/styles/Navbar.css"
const { Dragger } = Upload;

const Decompile = () => {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      message.error("Please select a file first!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/decompile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.download_url) {
        message.success("File uploaded successfully!");
        setDownloadUrl(data.download_url);
      } else {
        message.error("File upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      message.error("Upload failed: " + error.message);
    }

    setUploading(false);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "decompiled_file"; // Change filename as needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{height:"70vh"}}>
      <Dragger
        beforeUpload={(file) => {
          setFile(file);
          return false; // Prevent auto upload
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to upload</p>
        <p className="ant-upload-hint">Supports only one file at a time.</p>
      </Dragger>
      <div style={{display:"flex",justifyContent:"center",width:"100%" }}>
        {!downloadUrl && (
          <Button
        className="btn"
        icon={<UploadOutlined />}
        onClick={handleUpload}
        loading={uploading}
        style={{ marginTop: 16 }}
        disabled={!file}
      >        
        {uploading ? "Uploading..." : "Upload"}
      </Button>
        )}
        {downloadUrl && (
          <Button
            type="primary"
            className="btn"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{ marginTop: 16, marginLeft: 8 }}
          >
            Download
          </Button>
        )}

      </div>


    </div>
  );
};

export default Decompile;
