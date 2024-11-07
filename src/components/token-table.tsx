import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CustomizeModal } from "@/components/customize-dialog";
import { ResponsiveLine } from "@nivo/line";

const fetchTokens = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true"
  );
  return response.json();
};

const SortableTableHead = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

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

export function TokenTable({ activeView, setActiveView }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columns, setColumns] = useState([
    { id: "name", header: "Coin", accessorFn: (row) => row.name },
    {
      id: "current_price",
      header: "Price",
      accessorFn: (row) => `$${row.current_price.toLocaleString()}`,
    },
    {
      id: "price_change_percentage_1h",
      header: "1h",
      accessorFn: (row) => {
        return "N/A";
      },
    },
    {
      id: "price_change_percentage_24h",
      header: "24h",
      accessorFn: (row) => `${row.price_change_percentage_24h.toFixed(2)}%`,
    },
    {
      id: "price_change_percentage_7d_in_currency",
      header: "7d",
      accessorFn: (row) => {
        if (row.sparkline_in_7d && row.sparkline_in_7d.price.length > 0) {
          const prices = row.sparkline_in_7d.price;
          const change =
            ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
          return `${change.toFixed(2)}%`;
        }
        return "N/A";
      },
    },
    {
      id: "total_volume",
      header: "24h Volume",
      accessorFn: (row) => `$${row.total_volume.toLocaleString()}`,
    },
    {
      id: "market_cap",
      header: "Market Cap",
      accessorFn: (row) => `$${row.market_cap.toLocaleString()}`,
    },
    {
      id: "sparkline",
      header: "Last 7 Days",
      accessorFn: (row) => row.sparkline_in_7d.price,
    },
  ]);

  console.log(columns, "ajnsj");

  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [savedViews, setSavedViews] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedViews");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const {
    data: tokens,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
  });

  console.log(tokens, "tokekek");

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
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("savedViews", JSON.stringify(savedViews));
    }
  }, [savedViews]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Button
          variant={activeView === "Trending" ? "default" : "outline"}
          onClick={() => setActiveView("Trending")}
        >
          Trending
        </Button>
        {Object.keys(savedViews).map((viewName) => (
          <Button
            key={viewName}
            variant={activeView === viewName ? "default" : "outline"}
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
                  items={columns.map((col) => col.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {columns.map((column) => (
                    <SortableTableHead key={column.id} id={column.id}>
                      {column.header}
                    </SortableTableHead>
                  ))}
                </SortableContext>
              </DndContext>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "sparkline" ? (
                      <div style={{ width: 120, height: 40 }}>
                        <ResponsiveLine
                          data={[
                            {
                              id: "sparkline",
                              data: row.original.sparkline_in_7d.price.map(
                                (price, index) => ({
                                  x: index,
                                  y: price,
                                })
                              ),
                            },
                          ]}
                          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                          xScale={{ type: "point" }}
                          yScale={{
                            type: "linear",
                            min: "auto",
                            max: "auto",
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
                          colors={{ scheme: "category10" }}
                        />
                      </div>
                    ) : (
                      flexRender(column.accessorFn(row.original), {})
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
        savedViews={savedViews}
        setSavedViews={setSavedViews}
        setActiveView={setActiveView}
      />
    </div>
  );
}
