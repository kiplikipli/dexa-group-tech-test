import { useState } from 'react';
import DialogEmployee from './DialogEmployee';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { TEmployee } from '@/types/employee';
import { toast } from 'sonner';
import { employeeService } from '@/services/employeeService';

type CreateEmployeeProps = {
  onSubmitCallback: (employee: TEmployee) => void;
};

export default function CreateEmployee({
  onSubmitCallback,
}: CreateEmployeeProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<TEmployee, 'id'>>({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    lastUpdate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const newEmployee = await employeeService.createEmployee(formData);
      onSubmitCallback(newEmployee);
      setDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobTitle: '',
        lastUpdate: '',
      });
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      jobTitle: '',
      lastUpdate: '',
    });
  };

  return (
    <DialogEmployee
      loadingSubmit={loading}
      dialogOpen={dialogOpen}
      onOpenChange={setDialogOpen}
      triggerButton={
        <Button onClick={resetForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      }
      handleSubmit={handleSubmit}
      handleChange={handleFormChange}
      formData={formData}
      editingEmployee={null}
    />
  );
}
