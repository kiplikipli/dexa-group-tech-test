'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Filter, X } from 'lucide-react';
import dayjs from 'dayjs';
import { Datepicker } from '@/components/ui/datepicker';

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'late' | 'absent';
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>(
    []
  );
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectKey, setSelectKey] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [attendances, startDate, endDate, selectedEmployees]);

  useEffect(() => {
    setAvailableEmployees((prev) =>
      prev.filter((emp) => !selectedEmployees.includes(emp.id))
    );
  }, [selectedEmployees]);

  const fetchData = async () => {
    try {
      // Mock data for demo - replace with actual Firebase queries
      const mockAttendances: Attendance[] = [
        {
          id: '1',
          employeeId: 'emp1',
          employeeName: 'John Doe',
          employeeEmail: 'john.doe@company.com',
          date: dayjs().format('YYYY-MM-DD'),
          checkIn: '09:00',
          checkOut: '17:30',
          status: 'present',
        },
        {
          id: '2',
          employeeId: 'emp2',
          employeeName: 'Jane Smith',
          employeeEmail: 'jane.smith@company.com',
          date: dayjs().format('YYYY-MM-DD'),
          checkIn: '09:15',
          checkOut: '17:45',
          status: 'late',
        },
        {
          id: '3',
          employeeId: 'emp3',
          employeeName: 'Mike Johnson',
          employeeEmail: 'mike.johnson@company.com',
          date: dayjs().format('YYYY-MM-DD'),
          checkIn: '08:45',
          checkOut: '17:15',
          status: 'present',
        },
        {
          id: '4',
          employeeId: 'emp1',
          employeeName: 'John Doe',
          employeeEmail: 'john.doe@company.com',
          date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
          checkIn: '09:05',
          checkOut: '17:25',
          status: 'present',
        },
        {
          id: '5',
          employeeId: 'emp2',
          employeeName: 'Jane Smith',
          employeeEmail: 'jane.smith@company.com',
          date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
          checkIn: '09:30',
          checkOut: '17:50',
          status: 'late',
        },
      ];

      const mockEmployees: Employee[] = [
        { id: 'emp1', name: 'John Doe', email: 'john.doe@company.com' },
        { id: 'emp2', name: 'Jane Smith', email: 'jane.smith@company.com' },
        { id: 'emp3', name: 'Mike Johnson', email: 'mike.johnson@company.com' },
        { id: 'emp4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com' },
        { id: 'emp5', name: 'David Brown', email: 'david.brown@company.com' },
      ];

      setAttendances(mockAttendances);
      setEmployees(mockEmployees);
      setAvailableEmployees(mockEmployees);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendances];

    // Filter by date range
    filtered = filtered.filter((attendance) => {
      const attendanceDate = attendance.date;
      return attendanceDate >= startDate && attendanceDate <= endDate;
    });

    // Filter by selected employees (if any selected)
    if (selectedEmployees.length > 0) {
      filtered = filtered.filter((attendance) =>
        selectedEmployees.includes(attendance.employeeId)
      );
    }

    setFilteredAttendances(filtered);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    if (!selectedEmployees.includes(employeeId)) {
      setSelectedEmployees((prev) => [...prev, employeeId]);
      setSelectKey((prev) => prev + 1);
    }
  };

  const removeEmployeeFilter = (employeeId: string) => {
    setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSelectedEmployeeNames = () => {
    return selectedEmployees
      .map((id) => employees.find((emp) => emp.id === id)?.name)
      .filter(Boolean);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Monitor and manage employee attendance records
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Datepicker
                  label="Start Date"
                  onChange={() => console.log('hello start date')}
                />
              </div>

              <div className="space-y-2">
                <Datepicker
                  label="End Date"
                  onChange={() => console.log('hello end date')}
                />
              </div>

              <div className="space-y-2">
                <Label>Filter by Employee</Label>
                <Select key={selectKey} onValueChange={handleEmployeeSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employees..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Empty
                      </SelectItem>
                    ) : (
                      availableEmployees.map((employee) => (
                        <SelectItem
                          key={employee.id}
                          value={employee.id}
                          disabled={selectedEmployees.includes(employee.id)}
                        >
                          {employee.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Employees Tags */}
            {selectedEmployees.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Selected Employees:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {getSelectedEmployeeNames().map((name, index) => {
                    const employeeId = selectedEmployees[index];
                    return (
                      <Badge
                        key={employeeId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeEmployeeFilter(employeeId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate(dayjs().format('YYYY-MM-DD'));
                  setEndDate(dayjs().format('YYYY-MM-DD'));
                  setSelectedEmployees([]);
                  setAvailableEmployees(employees);
                }}
              >
                Clear Filters
              </Button>
              {selectedEmployees.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedEmployees([]);
                    setAvailableEmployees(employees);
                  }}
                >
                  Clear Employee Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              Showing {filteredAttendances.length} of {attendances.length}{' '}
              records
              {selectedEmployees.length > 0 &&
                ` for ${selectedEmployees.length} selected employee(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredAttendances.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No attendance records found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {attendance.employeeName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {attendance.employeeEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{attendance.date}</TableCell>
                      <TableCell>{attendance.checkIn}</TableCell>
                      <TableCell>{attendance.checkOut || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(attendance.status)}>
                          {attendance.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
