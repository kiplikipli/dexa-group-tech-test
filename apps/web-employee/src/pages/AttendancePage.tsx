'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Filter, Download } from 'lucide-react';
import Layout from '@/components/Layout';

type AttendanceRecord = {
  id: number;
  employeeId: number;
  checkInTime: string;
  checkOutTime?: string;
  totalWorkingSeconds?: number;
};

interface AttendanceProps {
  employeeId?: number;
}

export function AttendancePage({ employeeId }: AttendanceProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Set default dates to current month
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
  const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

  const filteredRecords = useMemo(() => {
    let filtered = attendanceRecords.filter(
      (record) => record.employeeId === employeeId
    );

    const filterStartDate = startDate || defaultStartDate;
    const filterEndDate = endDate || defaultEndDate;

    filtered = filtered.filter((record) => {
      const recordDate = new Date(record.checkInTime);
      const start = new Date(filterStartDate);
      const end = new Date(filterEndDate);
      return recordDate >= start && recordDate <= end;
    });

    return filtered.sort(
      (a, b) =>
        new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
    );
  }, [
    attendanceRecords,
    employeeId,
    startDate,
    endDate,
    defaultStartDate,
    defaultEndDate,
  ]);

  const totalWorkingHours = filteredRecords.reduce((total, record) => {
    return total + (record.totalWorkingSeconds || 0);
  }, 0);

  const totalWorkingDays = filteredRecords.filter(
    (record) => record.checkInTime && record.checkOutTime
  ).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (record: AttendanceRecord) => {
    if (record.checkInTime && record.checkOutTime) {
      return (
        <Badge variant="default" className="bg-green-500">
          Complete
        </Badge>
      );
    }
    if (record.checkInTime && !record.checkOutTime) {
      return <Badge variant="secondary">Incomplete</Badge>;
    }
    return <Badge variant="outline">No Record</Badge>;
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Check In', 'Check Out', 'Working Hours', 'Status'],
      ...filteredRecords.map((record) => [
        record.checkInTime,
        record.checkInTime || '',
        record.checkOutTime || '',
        record.totalWorkingSeconds?.toString() || '',
        record.checkInTime && record.checkOutTime
          ? 'Complete'
          : record.checkInTime
          ? 'Incomplete'
          : 'No Record',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${defaultStartDate}-to-${defaultEndDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-600 mt-1">
          View and manage your attendance history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Working Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalWorkingHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkingDays}</div>
            <p className="text-xs text-muted-foreground">
              Complete attendance records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Hours/Day
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalWorkingDays > 0
                ? (totalWorkingHours / totalWorkingDays).toFixed(1)
                : '0.0'}
              h
            </div>
            <p className="text-xs text-muted-foreground">
              Based on complete days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter & Export</CardTitle>
          <CardDescription>
            Filter attendance records by date range and export data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder={defaultStartDate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder={defaultEndDate}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} records for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No attendance records found for the selected period
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {formatDate(record.checkInTime)}
                      </TableCell>
                      <TableCell>{record.checkInTime || '--:--'}</TableCell>
                      <TableCell>{record.checkOutTime || '--:--'}</TableCell>
                      <TableCell>
                        {record.totalWorkingSeconds
                          ? `${record.totalWorkingSeconds.toFixed(1)}h`
                          : '--'}
                      </TableCell>
                      <TableCell>{getStatusBadge(record)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
