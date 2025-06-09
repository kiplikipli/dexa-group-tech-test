import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TEmployee } from '@/types/employee';
import { Loader2 } from 'lucide-react';

type DialogEmployeeProps = {
  loadingSubmit: boolean;
  dialogOpen: boolean;
  triggerButton: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  editingEmployee: TEmployee | null;
  formData: TEmployee | Omit<TEmployee, 'id'>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function DialogEmployee({
  loadingSubmit = false,
  dialogOpen,
  triggerButton,
  editingEmployee,
  formData,
  handleChange,
  onOpenChange,
  handleSubmit,
}: DialogEmployeeProps) {
  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            {editingEmployee
              ? 'Update the employee information below.'
              : 'Fill in the employee details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
