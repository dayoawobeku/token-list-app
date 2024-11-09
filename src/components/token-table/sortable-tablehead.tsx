import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ArrowDown, ArrowUp, ArrowUpDown} from 'lucide-react';
import {TableHead} from '@/components/ui/table';

interface SortableTableHeadProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
  isSortable: boolean;
  sortDirection?: 'asc' | 'desc' | false;
}

export function SortableTableHead({
  children,
  id,
  isSortable,
  sortDirection,
  ...props
}: SortableTableHeadProps) {
  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableHead ref={setNodeRef} style={style} {...props}>
      <div className="flex items-center gap-2">
        {isSortable && (
          <div
            className="cursor-pointer"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              props.onClick?.(e as React.MouseEvent<HTMLTableCellElement>);
            }}
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : sortDirection === 'desc' ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </div>
        )}
        <div className="flex-1 cursor-grab" {...attributes} {...listeners}>
          {children}
        </div>
      </div>
    </TableHead>
  );
}
