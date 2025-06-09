import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DialogEmployee from './DialogEmployee';
import { useEffect, useState } from 'react';
import type { TEmployee } from '@/types/employee';
import { employeeService } from '@/services/employeeService';

interface EditEmployeeProps {
  employee: TEmployee;
  onSubmitCallback: (employee: TEmployee) => void;
}

export default function EditEmployee({
  employee,
  onSubmitCallback,
}: EditEmployeeProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TEmployee>({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    id: 0,
    lastUpdate: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedEmployee = await employeeService.updateEmployee(
      employee.id,
      formData
    );
    onSubmitCallback(updatedEmployee);
    setLoading(false);
  };

  useEffect(() => {
    setFormData({ ...employee });
  }, [employee]);

  return (
    <DialogEmployee
      loadingSubmit={loading}
      dialogOpen={dialogOpen}
      onOpenChange={setDialogOpen}
      triggerButton={
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      }
      handleSubmit={handleSubmit}
      handleChange={handleFormChange}
      formData={formData}
      editingEmployee={employee}
    />
  );
}
