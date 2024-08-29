'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Company {
  id: string
  name: string
  shortDescription: string
  fundingTotal: string
  lastFundingType: string
  numEmployeesEnum: string
  semrushGlobalRank: string
}

const columns: ColumnDef<Company>[] = [
  {
    accessorKey: 'semrushGlobalRank',
    header: 'Rank',
    cell: ({ row }) => parseInt(row.getValue('semrushGlobalRank')) || 'N/A',
  },
  {
    accessorKey: 'name',
    header: 'Company Name',
  },
  {
    accessorKey: 'shortDescription',
    header: 'Description',
  },
  {
    accessorKey: 'fundingTotal',
    header: 'Total Funding',
  },
  {
    accessorKey: 'lastFundingType',
    header: 'Last Funding',
  },
  {
    accessorKey: 'numEmployeesEnum',
    header: 'Company Size',
    cell: ({ row }) => {
      const value = row.getValue('numEmployeesEnum') as string;
      const employee_range = {
        "c_00001_00010": "1-10",
        "c_00011_00050": "11-50",
        "c_00051_00100": "51-100",
        "c_00101_00250": "101-250",
        "c_00251_00500": "251-500",
        "c_00501_01000": "501-1000",
        "c_01001_05000": "1001-5000",
        "c_05001_10000": "5001-10000",
        "c_10001_max": "10001+"
      };
      return employee_range[value as keyof typeof employee_range] || value;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const company = row.original
      return (
        <Link href={`/company/${company.id}`} passHref>
          <Button variant="outline" size="sm">
            View
          </Button>
        </Link>
      )
    },
  },
]

export function CompanyDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [data, setData] = React.useState<Company[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(0)
  const [search, setSearch] = React.useState('')

  const fetchCompanies = async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      search,
      sortBy: sorting[0]?.id || 'semrushGlobalRank',
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    });
    const response = await fetch(`/api/companies?${params}`);
    const result = await response.json();
    setData(result.companies);
    setTotalPages(result.totalPages);
  };

  React.useEffect(() => {
    fetchCompanies();
  }, [currentPage, sorting, search]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <Input
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
