'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { CheckInOutModal } from '@/components/check-in-out-modal';
import { toast } from 'sonner';
import type { TAttendanceRecord } from '@/types/attendance';
import { attendanceService } from '@/services/attendanceService';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function DashboardPage() {
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState<TAttendanceRecord | null>(
    null
  );

  const formatTimeWithSeconds = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatTimeDisplay = (timeString: string) => {
    const dayjsTime = dayjs(timeString);
    if (dayjsTime.isValid()) {
      return dayjsTime.format('HH:mm:ss');
    }
  };

  const getCurrentTimeString = () => {
    return formatTimeWithSeconds(currentTime);
  };

  const handleCheckIn = async () => {
    try {
      if (!todayRecord) {
        const newAttendance = await attendanceService.checkIn();
        setTodayRecord(newAttendance);
      }
      setShowCheckInModal(false);
      toast.success('Successfully checked in', {
        position: 'top-center',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      if (todayRecord) {
        const newAttendance = await attendanceService.checkOut();
        setTodayRecord(newAttendance);
      }
      setShowCheckOutModal(false);
      toast.success('Successfully checked out', {
        position: 'top-center',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to check out');
    }
  };

  const getStatusBadge = () => {
    if (!todayRecord) {
      return <Badge variant="secondary">Not Checked In</Badge>;
    }
    if (todayRecord.checkInTime && !todayRecord.checkOutTime) {
      return (
        <Badge variant="default" className="bg-green-500">
          Checked In
        </Badge>
      );
    }
    if (todayRecord.checkInTime && todayRecord.checkOutTime) {
      return <Badge variant="outline">Checked Out</Badge>;
    }
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getWorkingTimeToday = () => {
    if (!todayRecord?.checkInTime) return '00:00:00';

    // Truncate milliseconds by parsing and formatting to second precision
    const checkIn = dayjs(todayRecord.checkInTime).set('millisecond', 0);
    let endTime = dayjs().set('millisecond', 0);

    if (todayRecord.checkOutTime) {
      endTime = dayjs(todayRecord.checkOutTime).set('millisecond', 0);
    }

    const diffInSeconds = endTime.diff(checkIn, 'second');
    const dur = dayjs.duration(diffInSeconds, 'seconds');

    const hours = dur.hours().toString().padStart(2, '0');
    const minutes = dur.minutes().toString().padStart(2, '0');
    const seconds = dur.seconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const fetchTodayAttendance = async () => {
    const startDay = dayjs().startOf('day');
    const endDay = dayjs().endOf('day');

    const todayAttendance = await attendanceService.getAttendances({
      checkInTimeFrom: startDay.toISOString(),
      checkInTimeTo: endDay.toISOString(),
    });

    if (todayAttendance.length > 0) {
      setTodayRecord(todayAttendance[0]);
    }
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchTodayAttendance();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-1">
            Manage your attendance and view your work summary
          </p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-wider">
              {getCurrentTimeString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDateDisplay(currentTime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Check-in
            </CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-wider">
              {todayRecord?.checkInTime
                ? formatTimeDisplay(todayRecord.checkInTime)
                : '--:--:--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayRecord?.checkInTime ? 'Checked in' : 'Not checked in yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Check-out
            </CardTitle>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-wider">
              {todayRecord?.checkOutTime
                ? formatTimeDisplay(todayRecord.checkOutTime)
                : '--:--:--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayRecord?.checkOutTime
                ? 'Checked out'
                : 'Not checked out yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Working Time Card */}
      {todayRecord && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Today's Working Time</span>
            </CardTitle>
            <CardDescription>
              {todayRecord.checkOutTime
                ? 'Total time worked today'
                : 'Current working time (live)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono tracking-wider text-center py-4">
              {getWorkingTimeToday()}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {todayRecord.checkOutTime ? (
                <span>Session completed</span>
              ) : (
                <span className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live tracking</span>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Check in or check out for today</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            onClick={() => setShowCheckInModal(true)}
            disabled={!!todayRecord?.checkInTime}
            className="flex items-center space-x-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Check In</span>
          </Button>

          <Button
            onClick={() => setShowCheckOutModal(true)}
            disabled={!todayRecord?.checkInTime || !!todayRecord?.checkOutTime}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Check Out</span>
          </Button>
        </CardContent>
      </Card>

      <CheckInOutModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onConfirm={handleCheckIn}
        type="checkin"
        currentTime={getCurrentTimeString()}
      />

      <CheckInOutModal
        isOpen={showCheckOutModal}
        onClose={() => setShowCheckOutModal(false)}
        onConfirm={handleCheckOut}
        type="checkout"
        currentTime={getCurrentTimeString()}
      />
    </div>
  );
}
