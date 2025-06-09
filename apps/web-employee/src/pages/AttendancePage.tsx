'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Calendar, Clock, Filter } from 'lucide-react';
import { attendanceService } from '@/services/attendanceService';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Datepicker } from '@/components/ui/datepicker';
import dayjs from 'dayjs';

dayjs.extend(isSameOrAfter);

type AttendanceRecord = {
  id: number;
  employeeId: number;
  checkInTime: string;
  checkOutTime?: string;
  totalWorkingSeconds?: number;
};

export function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(
    dayjs().startOf('month')
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs().endOf('month'));
  const [dateRanges, setDateRanges] = useState<dayjs.Dayjs[]>([]);

  const totalWorkingHours = attendanceRecords.reduce((total, record) => {
    return total + (record.totalWorkingSeconds || 0) / 3600;
  }, 0);

  const totalWorkingDays = attendanceRecords.filter(
    (record) => record.checkInTime && record.checkOutTime
  ).length;

  const getStatusBadge = (record?: AttendanceRecord) => {
    if (!record) {
      return <Badge variant="outline">No Record</Badge>;
    }

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
    setStartDate(dayjs().startOf('month'));
    setEndDate(dayjs().endOf('month'));
  };

  const formatDateFromString = (dateString: string): string => {
    return dayjs(dateString).format('HH:mm:ss');
  };

  const getWorkingTimeDuration = (totalWorkingSeconds?: number) => {
    // convert total working seconds to {hours}h:{minutes}m:{seconds}s
    if (!totalWorkingSeconds) return '0h:0m:0s';
    const hours = Math.floor(totalWorkingSeconds / 3600);
    const minutes = Math.floor((totalWorkingSeconds % 3600) / 60);
    const seconds = totalWorkingSeconds % 60;

    return `${hours}h:${minutes}m:${seconds}s`;
  };

  const fetchAttendances = async () => {
    try {
      const attendances = await attendanceService.getAttendances({
        checkInTimeFrom: startDate.toISOString(),
        checkInTimeTo: endDate.endOf('day').toISOString(),
      });
      setAttendanceRecords(attendances);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    }
  };

  const getDateRangeDesc = () => {
    const dates = [];
    let current = endDate;

    while (current.isSameOrAfter(startDate, 'day')) {
      dates.push(current);
      current = current.subtract(1, 'day');
    }

    return dates;
  };

  useEffect(() => {
    fetchAttendances();
    setDateRanges(getDateRangeDesc());
  }, [startDate, endDate]);

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
              <Datepicker
                defaultValue={startDate}
                label="Start Date"
                onChange={(date) => setStartDate(date)}
              />
              <Datepicker
                defaultValue={endDate}
                label="End Date"
                onChange={(date) => setEndDate(date)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Showing {attendanceRecords.length} records for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table className="tabular-nums font-mono">
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
                {dateRanges.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      Fail parsing date range
                    </TableCell>
                  </TableRow>
                ) : (
                  dateRanges.map((date, index) => {
                    const record = attendanceRecords.find((record) => {
                      if (!record.checkInTime) {
                        return false;
                      }

                      return dayjs(record.checkInTime).isSame(date, 'day');
                    });

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {date.format('DD MMMM YYYY')}
                        </TableCell>
                        <TableCell>
                          {record && record.checkInTime
                            ? formatDateFromString(record.checkInTime)
                            : '--:--'}
                        </TableCell>
                        <TableCell>
                          {record && record.checkOutTime
                            ? formatDateFromString(record.checkOutTime)
                            : '--:--'}
                        </TableCell>
                        <TableCell>
                          {getWorkingTimeDuration(record?.totalWorkingSeconds)}
                        </TableCell>
                        <TableCell>{getStatusBadge(record)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
