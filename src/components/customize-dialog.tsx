import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CustomizeModal({
  isOpen,
  onClose,
  columns,
  setColumns,
  savedViews,
  setSavedViews,
  setActiveView,
}) {
  const [selectedColumns, setSelectedColumns] = useState(
    columns.map((col) => col.id)
  );
  const [viewName, setViewName] = useState("");

  const handleColumnToggle = (columnId) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSave = () => {
    const newColumns = columns.filter((col) =>
      selectedColumns.includes(col.id)
    );
    setColumns(newColumns);
    if (viewName) {
      setSavedViews((prev) => ({ ...prev, [viewName]: newColumns }));
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
          {columns.map((column) => (
            <div key={column.id} className="flex items-center space-x-2">
              <Checkbox
                id={column.id}
                checked={selectedColumns.includes(column.id)}
                onCheckedChange={() => handleColumnToggle(column.id)}
              />
              <label htmlFor={column.id}>{column.header}</label>
            </div>
          ))}
          <Input
            placeholder="Enter view name"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
          />
          <Button onClick={handleSave}>Save View</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
