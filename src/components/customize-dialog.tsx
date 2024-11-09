import {useState, useEffect} from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {GripVertical} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {TokenColumnWithStringId} from '@/types/token';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: TokenColumnWithStringId[];
  setColumns: React.Dispatch<React.SetStateAction<TokenColumnWithStringId[]>>;
  savedViews: Record<string, TokenColumnWithStringId[]>;
  setSavedViews: React.Dispatch<
    React.SetStateAction<Record<string, TokenColumnWithStringId[]>>
  >;
  setActiveView: (view: string) => void;
  activeView: string;
}

interface SortableItemProps {
  column: TokenColumnWithStringId;
  isChecked: boolean;
  onToggle: () => void;
}

const SortableItem = ({column, isChecked, onToggle}: SortableItemProps) => {
  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({id: column.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2 py-2"
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <GripVertical size={20} />
      </div>
      <Checkbox id={column.id} checked={isChecked} onCheckedChange={onToggle} />
      <label
        htmlFor={column.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {column.header as string}
      </label>
    </div>
  );
};

export function CustomizeDialog({
  isOpen,
  onClose,
  columns,
  setColumns,
  savedViews,
  setSavedViews,
  setActiveView,
  activeView,
}: CustomizeModalProps) {
  const [orderedColumns, setOrderedColumns] = useState<
    TokenColumnWithStringId[]
  >([]);
  const [selectedColumnIds, setSelectedColumnIds] = useState<Set<string>>(
    new Set(),
  );
  const [viewName, setViewName] = useState('');

  useEffect(() => {
    setOrderedColumns(columns);
    setSelectedColumnIds(new Set(columns.map(col => col.id)));
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumnIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id !== over?.id) {
      setOrderedColumns(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    const newColumns = orderedColumns.filter(col =>
      selectedColumnIds.has(col.id),
    );
    if (viewName) {
      const updatedViews = {...savedViews, [viewName]: newColumns};
      setSavedViews(updatedViews);
      setActiveView(viewName);
      localStorage.setItem('savedViews', JSON.stringify(updatedViews));
    } else {
      const updatedViews = {...savedViews, [activeView]: newColumns};
      setSavedViews(updatedViews);
      setColumns(newColumns);
      localStorage.setItem('savedViews', JSON.stringify(updatedViews));
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize View</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedColumns.map(col => col.id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedColumns.map(column => (
                <SortableItem
                  key={column.id}
                  column={column}
                  isChecked={selectedColumnIds.has(column.id)}
                  onToggle={() => handleColumnToggle(column.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Input
            placeholder="Enter view name (optional)"
            value={viewName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setViewName(e.target.value)
            }
          />
          <Button onClick={handleSave} className="w-full">
            Save View
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
