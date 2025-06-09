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
import dayjs from 'dayjs';
import { Datepicker } from '@/components/ui/datepicker';

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

  const totalWorkingHours = attendanceRecords.reduce((total, record) => {
    return total + (record.totalWorkingSeconds || 0) / 3600;
  }, 0);

  const totalWorkingDays = attendanceRecords.filter(
    (record) => record.checkInTime && record.checkOutTime
  ).length;

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

  useEffect(() => {
    fetchAttendances();
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
                {attendanceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No attendance records found for the selected period
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {dayjs(record.checkInTime).format('dddd, DD MMMM YYYY')}
                      </TableCell>
                      <TableCell>
                        {record.checkInTime
                          ? formatDateFromString(record.checkInTime)
                          : '--:--'}
                      </TableCell>
                      <TableCell>
                        {record.checkOutTime
                          ? formatDateFromString(record.checkOutTime)
                          : '--:--'}
                      </TableCell>
                      <TableCell>
                        {getWorkingTimeDuration(record.totalWorkingSeconds)}
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
