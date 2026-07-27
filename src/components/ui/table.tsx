import React from 'react';

export const TableContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`w-full overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-xs ${className}`} {...props} />
);

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({ className = '', ...props }) => (
  <table className={`w-full text-left border-collapse text-sm ${className}`} {...props} />
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = '', ...props }) => (
  <thead className={`bg-[#FAF8F6]/80 border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider ${className}`} {...props} />
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = '', ...props }) => (
  <tbody className={`divide-y divide-slate-100 text-slate-700 ${className}`} {...props} />
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className = '', ...props }) => (
  <tr className={`hover:bg-[#FAF8F6]/50 transition-colors duration-150 ${className}`} {...props} />
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className = '', ...props }) => (
  <th className={`py-3.5 px-6 font-semibold align-middle ${className}`} {...props} />
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = '', ...props }) => (
  <td className={`py-4 px-6 align-middle ${className}`} {...props} />
);
