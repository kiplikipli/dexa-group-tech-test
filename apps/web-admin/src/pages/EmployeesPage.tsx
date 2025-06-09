import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CreateEmployee from '@/components/employees/dialogs/CreateEmployee';
import ListEmployee from '@/components/employees/tables/ListEmployee';
import type { TEmployee } from '@/types/employee';
import { useState } from 'react';
import { toast } from 'sonner';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<TEmployee[]>([]);

  const onSubmitCallback = (newEmployee: TEmployee) => {
    setEmployees((prev) => [newEmployee, ...prev]); // add to beginning of list
    toast.success('Employee created successfully', {
      position: 'top-center',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employee Management
            </h1>
            <p className="text-gray-600">
              Manage your organization's employees
            </p>
          </div>

          <CreateEmployee onSubmitCallback={onSubmitCallback} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>List of Employees</CardDescription>
          </CardHeader>
          <CardContent>
            <ListEmployee employees={employees} setEmployees={setEmployees} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
