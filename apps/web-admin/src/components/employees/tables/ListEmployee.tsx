import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { employeeService } from '@/services/employeeService';
import { Mail, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import EditEmployee from '../dialogs/EditEmployee';
import type { TEmployee } from '@/types/employee';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  lastUpdate: string;
}

type ListEmployeeProps = {
  employees: TEmployee[];
  setEmployees?: React.Dispatch<React.SetStateAction<TEmployee[]>>;
};

export default function ListEmployee({
  employees,
  setEmployees,
}: ListEmployeeProps) {
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const employees = await employeeService.getEmployees();
      if (setEmployees) {
        setEmployees(employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const onSubmitCallback = async (updatedEmployee: Employee) => {
    if (setEmployees) {
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        )
      );
    }
    toast.success('Employee updated successfully', {
      position: 'top-center',
    });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : employees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No employees found. Add your first employee to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-mono text-sm">
                  {employee.id}
                </TableCell>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-500" />
                    {employee.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                    {employee.jobTitle}
                  </div>
                </TableCell>
                <TableCell>{formatDate(employee.lastUpdate)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <EditEmployee
                      employee={employee}
                      onSubmitCallback={onSubmitCallback}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
