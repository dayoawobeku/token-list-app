import {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {restrictToHorizontalAxis} from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {Loader, TriangleAlert} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {CustomizeDialog} from '@/components/customize-dialog';
import {API_CONSTANTS} from '@/utils/constants';
import {Token, TokenColumnWithStringId} from '@/types/token';
import {fetchTokens} from '@/services/coingecko';
import {SortableTableHead} from './sortable-tablehead';
import {defaultColumns} from './default-columns';

const typedDefaultColumns: TokenColumnWithStringId[] = defaultColumns.map(
  col => ({
    ...col,
    id: col.id as string,
  }),
);

interface TokenTableProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function TokenTable({activeView, setActiveView}: TokenTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columns, setColumns] =
    useState<TokenColumnWithStringId[]>(typedDefaultColumns);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [savedViews, setSavedViews] = useState<
    Record<string, TokenColumnWithStringId[]>
  >(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedViews');
      return saved ? JSON.parse(saved) : {Trending: defaultColumns};
    }
    return {Trending: defaultColumns};
  });

  useEffect(() => {
    const loadSavedView = () => {
      if (activeView === 'Trending') {
        setColumns(defaultColumns);
      } else if (savedViews[activeView]) {
        const savedColumns = savedViews[activeView];
        const updatedColumns = savedColumns.map(savedColumn => {
          const defaultColumn = defaultColumns.find(
            col => col.id === savedColumn.id,
          );
          return {
            ...savedColumn,
            accessorFn: defaultColumn?.accessorFn,
            cell: defaultColumn?.cell,
            sortingFn: defaultColumn?.sortingFn,
          };
        });
        setColumns(updatedColumns);
      }
    };

    loadSavedView();
  }, [activeView, savedViews]);

  const {
    data: tokens,
    status,
    error,
  } = useQuery<Token[], Error>({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    refetchInterval: API_CONSTANTS.CACHE_DURATION,
  });

  const table = useReactTable({
    data: tokens || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    enableMultiSort: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id !== over?.id) {
      setColumns(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (status === 'pending') return <Loader className="animate-spin" />;

  if (status === 'error') {
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred';
    return (
      <div className="flex items-center gap-3 p-4 bg-red-100 text-red-500 rounded-md">
        <TriangleAlert width={20} height={20} className="stroke-red-500" />
        {errorMessage}
      </div>
    );
  }

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'Trending' ? 'secondary' : 'outline'}
              className={`${
                activeView === 'Trending' ? 'font-semibold' : 'text-neutral-500'
              }`}
              onClick={() => setActiveView('Trending')}
            >
              Trending
            </Button>
            {Object.keys(savedViews)
              .filter(view => view !== 'Trending')
              .map(viewName => (
                <Button
                  key={viewName}
                  variant={activeView === viewName ? 'secondary' : 'outline'}
                  className={`${
                    activeView === viewName
                      ? 'font-semibold'
                      : 'text-neutral-500'
                  }`}
                  onClick={() => setActiveView(viewName)}
                >
                  {viewName}
                </Button>
              ))}
          </div>
          <Button onClick={() => setIsCustomizeModalOpen(true)}>
            Customize
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis]}
              >
                <SortableContext
                  items={columns.map(col => col.id as string)}
                  strategy={horizontalListSortingStrategy}
                >
                  {columns.map(column => {
                    const sortDirection = table
                      .getColumn(column.id as string)
                      ?.getIsSorted();
                    return (
                      <SortableTableHead
                        key={column.id as string}
                        id={column.id as string}
                        isSortable={column.enableSorting !== false}
                        sortDirection={sortDirection}
                        onClick={() =>
                          table.getColumn(column.id as string)?.toggleSorting()
                        }
                      >
                        {column.header as string}
                      </SortableTableHead>
                    );
                  })}
                </SortableContext>
              </DndContext>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CustomizeDialog
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        columns={defaultColumns}
        setColumns={setColumns}
        savedViews={savedViews}
        setSavedViews={setSavedViews}
        setActiveView={setActiveView}
        activeView={activeView}
      />
    </div>
  );
}
