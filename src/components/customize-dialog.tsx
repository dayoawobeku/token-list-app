import {useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {TokenColumn} from '@/types/token';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: TokenColumn[];
  setColumns: React.Dispatch<React.SetStateAction<TokenColumn[]>>;
  setSavedViews: React.Dispatch<
    React.SetStateAction<Record<string, TokenColumn[]>>
  >;
  setActiveView: (view: string) => void;
}

export function CustomizeModal({
  isOpen,
  onClose,
  columns,
  setColumns,
  setSavedViews,
  setActiveView,
}: CustomizeModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map(col => col.id as string),
  );
  const [viewName, setViewName] = useState('');

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId],
    );
  };

  const handleSave = () => {
    const newColumns = columns.filter(col =>
      selectedColumns.includes(col.id as string),
    );
    setColumns(newColumns);
    if (viewName) {
      setSavedViews(prev => ({...prev, [viewName]: newColumns}));
      setActiveView(viewName);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize View</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {columns.map(column => (
            <div
              key={column.id as string}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={column.id as string}
                checked={selectedColumns.includes(column.id as string)}
                onCheckedChange={() => handleColumnToggle(column.id as string)}
              />
              <label htmlFor={column.id as string}>
                {column.header as string}
              </label>
            </div>
          ))}
          <Input
            placeholder="Enter view name"
            value={viewName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setViewName(e.target.value)
            }
          />
          <Button onClick={handleSave}>Save View</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
