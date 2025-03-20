import React from "react";

interface TokenReportLayoutProps {
  tokenData: {
    tokenNumber: string;
    patientName: string;
    mrNumber: string;
    department?: string;
    doctorName?: string;
    date: string;
    time: string;
  };
}

const TokenReportLayout: React.FC<TokenReportLayoutProps> = ({ tokenData }) => {
  return (
    <div className="token-report-container">
      <style jsx>{`
        .token-report-container {
          font-family: Arial, sans-serif;
          max-width: 80mm;
          margin: 0 auto;
          padding: 10px;
          border: 1px solid #ccc;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 10px;
        }
        .hospital-name {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
        }
        .hospital-address {
          font-size: 12px;
          margin: 5px 0;
        }
        .token-number {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin: 15px 0;
          padding: 5px;
          border: 2px solid #000;
          border-radius: 5px;
        }
        .patient-info {
          margin: 10px 0;
          font-size: 14px;
        }
        .patient-info p {
          margin: 5px 0;
        }
        .footer {
          text-align: center;
          margin-top: 15px;
          font-size: 12px;
          border-top: 1px dashed #ccc;
          padding-top: 10px;
        }
        .label {
          font-weight: bold;
        }
        .date-time {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin: 10px 0;
        }
        @media print {
          .token-report-container {
            border: none;
          }
        }
      `}</style>
      <div className="header">
        <p className="hospital-name">Healthcare Hospital</p>
        <p className="hospital-address">123 Medical Center Road, City</p>
        <p className="hospital-address">Phone: (123) 456-7890</p>
      </div>

      <div className="token-number">Token: {tokenData.tokenNumber}</div>

      <div className="patient-info">
        <p>
          <span className="label">Patient:</span> {tokenData.patientName}
        </p>
        <p>
          <span className="label">MR#:</span> {tokenData.mrNumber}
        </p>
        {tokenData.department && (
          <p>
            <span className="label">Department:</span> {tokenData.department}
          </p>
        )}
        {tokenData.doctorName && (
          <p>
            <span className="label">Doctor:</span> {tokenData.doctorName}
          </p>
        )}
      </div>

      <div className="date-time">
        <span>{tokenData.date}</span>
        <span>{tokenData.time}</span>
      </div>

      <div className="footer">
        <p>Please keep this token and present it at reception</p>
        <p>Thank you for choosing Healthcare Hospital</p>
      </div>
    </div>
  );
};

export default TokenReportLayout;
