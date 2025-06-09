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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Briefcase, Lock } from 'lucide-react';
import { PhotoUpload } from '@/components/photo-upload';
import { employeeService } from '@/services/employeeService';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { AxiosError } from 'axios';

type Employee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  jobTitle: string;
};

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState<Employee>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    photoUrl: '',
    jobTitle: '',
  });
  const [phone, setPhone] = useState(employee.phone);
  const [photoUrl, setPhotoUrl] = useState(employee.photoUrl);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSaveProfile = async () => {
    try {
      await employeeService.updateProfile({
        phone,
      });

      setIsEditing(false);
      setEmployee((prev) => ({ ...prev, phone }));
      toast.success('Profile updated successfully!', {
        position: 'top-center',
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error('Failed to update profile', {
          position: 'top-center',
          description: err.response?.data?.error,
        });
      }

      console.error(err);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await authService.updatePassword({
        oldPassword: currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
      toast.success('Password changed successfully!', {
        position: 'top-center',
      });
    } catch (err) {
      let errMessageDescription = '';
      if (err instanceof AxiosError) {
        errMessageDescription = err.response?.data?.error;
      }

      console.error(err);
      toast.error('Failed to change password', {
        position: 'top-center',
        description: errMessageDescription,
      });
    }
  };

  const handlePhotoUpload = (newPhotoUrl: string) => {
    setPhotoUrl(newPhotoUrl);
  };

  const fetchEmployee = async () => {
    if (user) {
      const employee = await employeeService.getEmployeeByUserId(user.id);
      if (employee) {
        setEmployee(employee);
        setPhone(employee.phone);
      }
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details. Only phone number and photo can be
              modified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={isEditing ? photoUrl : employee.photoUrl}
                  alt={employee.name}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <PhotoUpload
                  currentPhotoUrl={photoUrl}
                  onPhotoUpload={handlePhotoUpload}
                  employeeId={employee.id}
                />
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    value={employee.name}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500">Name cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={employee.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={isEditing ? phone : employee.phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <Input
                    id="jobTitle"
                    value={employee.jobTitle}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Job title cannot be changed
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setPhone(employee.phone);
                      setPhotoUrl(employee.photoUrl);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Manage your account password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Password</span>
              </div>
              <Badge variant="outline">Protected</Badge>
            </div>

            {!showPasswordChange ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPasswordChange(true)}
              >
                Change Password
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handlePasswordChange}
                    disabled={
                      !currentPassword || !newPassword || !confirmPassword
                    }
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
