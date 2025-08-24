"use client"

import { useState, useMemo } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  CalendarIcon
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { ActivityDetailSheet } from "@/components/activity-detail-sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

interface ActivityItem {
  type: string
  description: string
  date: string
  details?: Record<string, unknown>
  requestedBy?: string
  status?: string
}

export default function HistoryPage() {
  const { state } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    type: "All",
  })
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({ key: "date", direction: "descending" })
  const [currentPage, setCurrentPage] = useState(1)
  const [isActivityDetailSheetOpen, setIsActivityDetailSheetOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)

  const handleViewActivityDetails = (activity: ActivityItem) => {
    setSelectedActivity(activity)
    setIsActivityDetailSheetOpen(true)
  }

  const filteredActivities = useMemo(() => {
    const filtered = state.recentActivities.filter((activity: ActivityItem) => {
      const matchesSearch =
        (activity.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.details?.product?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.details?.assignedTo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.details?.lentTo || "").toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filters.type === "All" || activity.type === filters.type

      // Date filter
      let matchesDate = true
      if (filterDate) {
        const activityDate = new Date(activity.date)
        matchesDate = activityDate.toDateString() === filterDate.toDateString()
      }

      return matchesSearch && matchesType && matchesDate
    })

    return filtered
  }, [state.recentActivities, searchTerm, filters, filterDate])

  const sortedActivities = useMemo(() => {
    if (!sortConfig) {
      return filteredActivities
    }

    const sorted = [...filteredActivities].sort((a: ActivityItem, b: ActivityItem) => {
      let aValue: string | number
      let bValue: string | number

      // Special handling for dates
      if (sortConfig.key === "date") {
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
      } else if (sortConfig.key === "type") {
        aValue = a.type
        bValue = b.type
      } else if (sortConfig.key === "description") {
        aValue = a.description
        bValue = b.description
      } else {
        const aRecord = a as Record<string, unknown>
        const bRecord = b as Record<string, unknown>
        aValue = (aRecord[sortConfig.key] as string | number) || ""
        bValue = (bRecord[sortConfig.key] as string | number) || ""
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
    return sorted
  }, [filteredActivities, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedActivities.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedActivities = sortedActivities.slice(startIndex, endIndex)

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    if (sortConfig.direction === "ascending") {
      return <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  const allActivityTypes = useMemo(() => {
    const types = new Set(state.recentActivities.map((a) => a.type).filter(Boolean))
    return ["All", ...Array.from(types).sort()]
  }, [state.recentActivities])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <Button variant="outline" onClick={() => setFilterDate(undefined)}>
          {filterDate ? "Clear Date Filter" : "Show All"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn(filterDate && "border-primary")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDate ? format(filterDate, "PPP") : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filterDate}
              onSelect={setFilterDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={cn(filters.type !== "All" && "border-primary")}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Activity Type</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allActivityTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={filters.type === type}
                      onCheckedChange={() => setFilters({ ...filters, type: type })}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort("type")} className="cursor-pointer">
                Type
                {getSortIcon("type")}
              </TableHead>
              <TableHead onClick={() => requestSort("description")} className="cursor-pointer">
                Description
                {getSortIcon("description")}
              </TableHead>
              <TableHead onClick={() => requestSort("date")} className="cursor-pointer">
                Date and Time
                {getSortIcon("date")}
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedActivities.length === 0 ? (
              <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No activities found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.type}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>
                    {activity.details && (
                      <Button variant="ghost" size="sm" onClick={() => handleViewActivityDetails(activity)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sortedActivities.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} - {Math.min(endIndex, sortedActivities.length)} of {sortedActivities.length} activities
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {selectedActivity && (
        <ActivityDetailSheet
          open={isActivityDetailSheetOpen}
          onOpenChange={setIsActivityDetailSheetOpen}
          activity={selectedActivity}
        />
      )}
    </div>
  )
}
