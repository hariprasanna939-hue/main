import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Edit2, Power, Trash2 } from 'lucide-react';

interface ActionButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
}

export function ViewButton({ href, onClick, disabled, title }: ActionButtonProps) {
  const button = (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer font-medium inline-flex items-center transition-all shadow-xs"
      title={title || 'View'}
    >
      <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
      <span>View</span>
    </Button>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className="inline-block">{button}</a>
      </Link>
    );
  }
  return button;
}

export function EditButton({ href, onClick, disabled, title }: ActionButtonProps) {
  const button = (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer font-medium inline-flex items-center transition-all shadow-xs"
      title={title || 'Edit'}
    >
      <Edit2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
      <span>Edit</span>
    </Button>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className="inline-block">{button}</a>
      </Link>
    );
  }
  return button;
}

interface ToggleButtonProps {
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
}

export function ToggleButton({ isActive, onClick, disabled, title }: ToggleButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={`h-8 w-8 !p-0 rounded-lg cursor-pointer border border-slate-200 inline-flex items-center justify-center transition-all shadow-xs ${
        isActive
          ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
          : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
      }`}
      title={title || (isActive ? 'Deactivate' : 'Activate')}
    >
      <Power className="w-3.5 h-3.5" />
    </Button>
  );
}

export function DeleteButton({ onClick, disabled, title }: ActionButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className="h-8 w-8 !p-0 rounded-lg cursor-pointer border border-slate-200 text-red-500 hover:text-red-600 hover:bg-red-50 inline-flex items-center justify-center transition-all shadow-xs"
      title={title || 'Delete'}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </Button>
  );
}
