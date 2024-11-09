import {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnDef,
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
  useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Loader} from 'lucide-react';
import {ResponsiveLine} from '@nivo/line';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {CustomizeModal} from '@/components/customize-dialog';
import {API_CONSTANTS} from '@/utils/constants';
import {Token} from '@/types/token';
import {fetchTokens} from '@/services/coingecko';

interface SortableTableHeadProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface TokenTableProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

type TokenColumn = ColumnDef<Token> & {
  accessorFn?: (row: Token) => string | number | number[] | null;
};

const SortableTableHead: React.FC<SortableTableHeadProps> = ({
  children,
  id,
  ...props
}) => {
  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      {...props}
    >
      {children}
    </TableHead>
  );
};

export function TokenTable({activeView, setActiveView}: TokenTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columns, setColumns] = useState<TokenColumn[]>([
    {id: 'name', header: 'Coin', accessorFn: (row: Token) => row.name},
    {
      id: 'current_price',
      header: 'Price',
      accessorFn: (row: Token) => `$${row.current_price.toLocaleString()}`,
    },
    {
      id: 'price_change_percentage_1h',
      header: '1h',
      accessorFn: () => 'N/A',
    },
    {
      id: 'price_change_percentage_24h',
      header: '24h',
      accessorFn: (row: Token) =>
        `${row.price_change_percentage_24h.toFixed(2)}%`,
    },
    {
      id: 'price_change_percentage_7d_in_currency',
      header: '7d',
      accessorFn: (row: Token) => {
        if (row.sparkline_in_7d && row.sparkline_in_7d.price.length > 0) {
          const prices = row.sparkline_in_7d.price;
          const change =
            ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
          return `${change.toFixed(2)}%`;
        }
        return 'N/A';
      },
    },
    {
      id: 'total_volume',
      header: '24h Volume',
      accessorFn: (row: Token) => `$${row.total_volume.toLocaleString()}`,
    },
    {
      id: 'market_cap',
      header: 'Market Cap',
      accessorFn: (row: Token) => `$${row.market_cap.toLocaleString()}`,
    },
    {
      id: 'sparkline',
      header: 'Last 7 Days',
      accessorFn: (row: Token) => row.sparkline_in_7d.price,
    },
  ]);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [savedViews, setSavedViews] = useState<Record<string, TokenColumn[]>>(
    () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('savedViews');
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    },
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedViews', JSON.stringify(savedViews));
    }
  }, [savedViews]);

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
      <div className="text-center p-4 bg-red-100 text-red-500 rounded-md">
        {errorMessage}
      </div>
    );
  }

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Button
          variant={activeView === 'Trending' ? 'default' : 'outline'}
          onClick={() => setActiveView('Trending')}
        >
          Trending
        </Button>
        {Object.keys(savedViews).map(viewName => (
          <Button
            key={viewName}
            variant={activeView === viewName ? 'default' : 'outline'}
            onClick={() => {
              setActiveView(viewName);
              setColumns(savedViews[viewName]);
            }}
          >
            {viewName}
          </Button>
        ))}
        <Button onClick={() => setIsCustomizeModalOpen(true)}>Customize</Button>
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
                  {columns.map(column => (
                    <SortableTableHead key={column.id} id={column.id as string}>
                      {column.header as string}
                    </SortableTableHead>
                  ))}
                </SortableContext>
              </DndContext>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {columns.map(column => (
                  <TableCell key={column.id}>
                    {column.id === 'sparkline' ? (
                      <div style={{width: 120, height: 40}}>
                        <ResponsiveLine
                          data={[
                            {
                              id: 'sparkline',
                              data: (
                                row.original.sparkline_in_7d.price as number[]
                              ).map((price, index) => ({
                                x: index,
                                y: price,
                              })),
                            },
                          ]}
                          margin={{top: 5, right: 5, bottom: 5, left: 5}}
                          xScale={{type: 'point'}}
                          yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: true,
                            reverse: false,
                          }}
                          curve="monotoneX"
                          axisTop={null}
                          axisRight={null}
                          axisBottom={null}
                          axisLeft={null}
                          enableGridX={false}
                          enableGridY={false}
                          enablePoints={false}
                          enableArea={true}
                          areaOpacity={0.1}
                          useMesh={true}
                          colors={{scheme: 'category10'}}
                        />
                      </div>
                    ) : (
                      flexRender(
                        column.accessorFn
                          ? column.accessorFn(row.original)
                          : null,
                        {},
                      )
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CustomizeModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        columns={columns}
        setColumns={setColumns}
        setSavedViews={setSavedViews}
        setActiveView={setActiveView}
      />
    </div>
  );
}
