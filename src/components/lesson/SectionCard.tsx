import React from 'react';
import { Edit2, RefreshCw, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface SectionCardProps {
  id: string;
  sectionNumber: number;
  title: string;
  description?: string;
  icon: React.ReactNode;
  isEditable?: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onRegenerate: () => Promise<void>;
  isRegenerating?: boolean;
  children: React.ReactNode;
  editForm?: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  id,
  sectionNumber,
  title,
  description,
  icon,
  isEditable = true,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onRegenerate,
  isRegenerating = false,
  children,
  editForm,
}) => {
  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-card transition-all"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {sectionNumber}. {title}
            </h3>
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
        </div>

        {isEditable && (
          <div className="flex items-center gap-2 no-print shrink-0">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onStartEdit}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerate}
                    isLoading={isRegenerating}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5 text-indigo-600" />}
                    className="border border-slate-200"
                  >
                    Regenerate
                  </Button>
                  <span className="pointer-events-none absolute -top-8 right-0 z-20 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md">
                    Regenerates ONLY {title}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancelEdit}
                  leftIcon={<X className="w-3.5 h-3.5" />}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSaveEdit}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Save Section
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 text-sm text-slate-700 leading-relaxed">
        {isEditing ? editForm : children}
      </div>
    </div>
  );
};
