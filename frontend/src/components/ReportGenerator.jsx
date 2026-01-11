import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const ReportGenerator = ({ isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [format, setFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFileSection, setShowFileSection] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const generateReport = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        period: reportType,
        format: format,
        include_charts: includeCharts.toString(),
        include_details: includeDetails.toString(),
      });

      // Add custom date range if selected
      if (reportType === 'custom' && customStartDate && customEndDate) {
        params.append('start_date', customStartDate);
        params.append('end_date', customEndDate);
      }

      const url = `${API_BASE_URL}/api/reports/reports/generate/?${params.toString()}`;
      
      console.log('Generating report...', { reportType, format, includeCharts, includeDetails, customStartDate, customEndDate, url });
      
      // Set appropriate headers based on format
      const acceptHeader = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      const response = await fetch(url, { 
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': acceptHeader,
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert(`Failed to generate ${format.toUpperCase()} report (${response.status}): ${errorText}`);
        setLoading(false);
        return;
      }

      // Create a blob from the response and download it
      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'type:', blob.type);
      
      // Check if we got the correct content type
      const expectedType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (blob.type !== expectedType && !blob.type.includes('text') && !blob.type.includes('application/octet-stream')) {
        const text = await blob.text();
        console.error('Received unexpected response:', text);
        alert(`Received unexpected response type: ${blob.type}`);
        setLoading(false);
        return;
      }
      
      if (blob.size === 0) {
        alert(`Received empty ${format.toUpperCase()} file. Please try again.`);
        setLoading(false);
        return;
      }

      // Force the correct file extension
      const fileExtension = format === 'pdf' ? 'pdf' : 'docx';
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = `ProShop-${reportType.title()}-Report-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(urlBlob);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error generating report:', error);
      alert(`Error generating ${format.toUpperCase()} report: ${error.message}. Please make sure the backend server is running.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch uploaded files
  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/reports/list_files/`, {
        credentials: 'include',
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data);
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  // Upload file
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
      alert('Only PDF and DOCX files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/reports/upload_file/`, {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert('File uploaded successfully!');
        fetchUploadedFiles(); // Refresh the file list
        setFileInputKey(Date.now()); // Reset file input
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete file
  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/reports/delete_file/?file_id=${fileId}`, {
        credentials: 'include',
        method: 'DELETE',
      });

      if (response.ok) {
        alert('File deleted successfully!');
        fetchUploadedFiles(); // Refresh the file list
        if (selectedFile && selectedFile.id === fileId) {
          setSelectedFile(null);
        }
      } else {
        const error = await response.json();
        alert(`Delete failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
    }
  };

  // Download uploaded file
  const handleDownloadFile = async (file) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/reports/download_file/?file_id=${file.id}`, {
        credentials: 'include',
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  // Fetch files when component mounts or file section is shown
  useEffect(() => {
    if (showFileSection) {
      fetchUploadedFiles();
    }
  }, [showFileSection]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
      }}
    >
      {/* Main Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          disabled={loading}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
            background: isDarkMode ? '#0f1419' : '#ffffff',
            color: isDarkMode ? 'white' : '#1a1a1a',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <option value="daily">📅 Daily Report</option>
          <option value="weekly">📊 Weekly Report</option>
          <option value="monthly">🗓️ Monthly Report</option>
          <option value="yearly">📈 Yearly Report</option>
          <option value="custom">🔧 Custom Range</option>
        </select>

        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          disabled={loading}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
            background: isDarkMode ? '#0f1419' : '#ffffff',
            color: isDarkMode ? 'white' : '#1a1a1a',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <option value="pdf">📄 PDF</option>
          <option value="docx">📝 Word (DOCX)</option>
        </select>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          disabled={loading}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
            background: isDarkMode ? '#1a1a2e' : '#f8fafc',
            color: isDarkMode ? 'white' : '#1a1a1a',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ⚙️ Options
        </button>

        <button
          onClick={() => setShowFileSection(!showFileSection)}
          disabled={loading}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
            background: isDarkMode ? '#1a1a2e' : '#f8fafc',
            color: isDarkMode ? 'white' : '#1a1a1a',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          📁 Manage Files
        </button>

        <button
          onClick={generateReport}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s',
            border: 'none',
          }}
        >
          {loading ? 'Generating...' : `📥 Download ${format.toUpperCase()}`}
        </button>
      </div>

      {/* Custom Date Range */}
      {reportType === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e0' : '#64748b' }}>Start Date</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              disabled={loading}
              style={{
                padding: '6px 8px',
                borderRadius: '4px',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                background: isDarkMode ? '#0f1419' : '#ffffff',
                color: isDarkMode ? 'white' : '#1a1a1a',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e0' : '#64748b' }}>End Date</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              disabled={loading}
              style={{
                padding: '6px 8px',
                borderRadius: '4px',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                background: isDarkMode ? '#0f1419' : '#ffffff',
                color: isDarkMode ? 'white' : '#1a1a1a',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      )}

      {/* Advanced Options */}
      {showAdvanced && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
            borderRadius: '6px',
            border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="includeCharts"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              disabled={loading}
            />
            <label
              htmlFor="includeCharts"
              style={{
                fontSize: '14px',
                color: isDarkMode ? 'white' : '#1a1a1a',
                cursor: 'pointer',
              }}
            >
              📊 Include Charts (PDF only)
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="includeDetails"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              disabled={loading}
            />
            <label
              htmlFor="includeDetails"
              style={{
                fontSize: '14px',
                color: isDarkMode ? 'white' : '#1a1a1a',
                cursor: 'pointer',
              }}
            >
              📋 Include Detailed Tables
            </label>
          </div>
        </div>
      )}

      {/* File Management Section */}
      {showFileSection && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px',
            background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
            borderRadius: '6px',
            border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: isDarkMode ? 'white' : '#1a1a1a' }}>
            📁 File Management
          </h4>

          {/* File Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: isDarkMode ? '#cbd5e0' : '#64748b' }}>
              Upload PDF or DOCX file:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                key={fileInputKey}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                disabled={uploadLoading}
                style={{
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                  background: isDarkMode ? '#0f1419' : '#ffffff',
                  color: isDarkMode ? 'white' : '#1a1a1a',
                  fontSize: '14px',
                }}
              />
              {uploadLoading && <span style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e0' : '#64748b' }}>Uploading...</span>}
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: isDarkMode ? '#cbd5e0' : '#64748b' }}>
                Uploaded files:
              </label>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>
                        {file.file_type === 'pdf' ? '📄' : '📝'}
                      </span>
                      <div>
                        <div style={{ fontSize: '14px', color: isDarkMode ? 'white' : '#1a1a1a' }}>
                          {file.filename}
                        </div>
                        <div style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e0' : '#64748b' }}>
                          {file.file_size_display} • {new Date(file.uploaded_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                          background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                          color: isDarkMode ? '#10b981' : '#059669',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        📥
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
                          background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                          color: isDarkMode ? '#ef4444' : '#dc2626',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadedFiles.length === 0 && (
            <div style={{ 
              padding: '16px', 
              textAlign: 'center', 
              color: isDarkMode ? '#cbd5e0' : '#64748b',
              fontSize: '14px',
              fontStyle: 'italic'
            }}>
              No files uploaded yet. Upload your first PDF or DOCX file above.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
