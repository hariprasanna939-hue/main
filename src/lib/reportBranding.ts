export const REPORT_FOOTER_COMPANY = "SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED";

export const DEFAULT_REPORT_COMPANY_NAME = "";

export const getReportCompanyName = (companyName?: string) =>
  companyName?.trim() || "Your Company Name";

export const formatPDFCurrency = (val: any, prefix = "Rs. "): string => {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num)) return `${prefix}0.00`;
  return `${prefix}${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatPDFNumber = (val: any): string => {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num)) return "0.00";
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatPDFRatio = (val: any, suffix = ""): string => {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num)) return `0.00${suffix}`;
  return `${num.toFixed(2)}${suffix}`;
};
