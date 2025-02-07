import "../Components/styles/Report.css"
import { useState, useEffect } from "react"
import { FileIcon, MoreVertical, Calendar, FileType, HardDrive, Shield, AlertTriangle, Clock } from "lucide-react"

export default function FileReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDropdownId, setOpenDropdownId] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports")
        if (!response.ok) throw new Error("Failed to fetch reports")
        const data = await response.json()
        setReports(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownWrappers = document.querySelectorAll(".dropdown-wrapper")
      const isOutside = Array.from(dropdownWrappers).every((wrapper) => !wrapper.contains(event.target))

      if (isOutside) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  if (loading) return <div>Loading reports...</div>
  if (error) return <div>Error: {error}</div>

  const safeFiles = reports.filter((r) => r.result !== "Malware").length
  const malwareFiles = reports.filter((r) => r.result === "Malware").length

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1 className="reports-title">Files Reports</h1>
        <div className="reports-stats">
          <div className="stat-item stat-safe">{safeFiles} Safe Files</div>
          <div className="stat-item stat-malware">{malwareFiles} Threats Detected</div>
        </div>
      </div>

      <div className="reports-list">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`report-item ${report.result === "Malware" ? "malware" : ""} ${
              openDropdownId === report.id ? "active" : ""
            }`}
          >
            <div className="report-main">
              <div className="report-icon">
                <FileIcon size={24} />
              </div>
              <div className="report-details">
                <div className="report-name">
                  {report.name}
                  <span className={`status-badge ${report.result === "Malware" ? "malware" : "safe"}`}>
                    {report.result === "Malware" ? "Malware Detected" : "Safe"}
                  </span>
                </div>
                <div className="report-meta">
                  <span className="meta-item">
                    <Clock size={16} />
                    {formatDate(report.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="dropdown-wrapper">
              <button
                className="dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdownId(openDropdownId === report.id ? null : report.id)
                }}
                aria-expanded={openDropdownId === report.id}
                aria-haspopup="true"
              >
                <MoreVertical size={20} color="black" />
              </button>

              {openDropdownId === report.id && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <div className="dropdown-title">File Details</div>
                  </div>
                  <div className="dropdown-content">
                    <div className="dropdown-item">
                      <span className="dropdown-label">
                        <FileIcon size={16} />
                        File name
                      </span>
                      <span className="dropdown-value">{report.name}</span>
                    </div>
                    <div className="dropdown-item">
                      <span className="dropdown-label">
                        <HardDrive size={16} />
                        File size
                      </span>
                      <span className="dropdown-value">{formatFileSize(report.size)}</span>
                    </div>
                    <div className="dropdown-item">
                      <span className="dropdown-label">
                        <FileType size={16} />
                        Extension
                      </span>
                      <span className="dropdown-value">.{report.extension}</span>
                    </div>
                    <div className="dropdown-item">
                      <span className="dropdown-label">
                        <Calendar size={16} />
                        Created at
                      </span>
                      <span className="dropdown-value">{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="dropdown-item">
                      <span className="dropdown-label">
                        {report.result === "Malware" ? <AlertTriangle size={16} /> : <Shield size={16} />}
                        Security Status
                      </span>
                      <span className={`status-badge ${report.result === "Malware" ? "malware" : "safe"}`}>
                        {report.result === "Malware" ? "Malware" : "Safe"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
