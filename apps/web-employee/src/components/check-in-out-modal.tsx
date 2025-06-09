'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogIn, LogOut } from 'lucide-react';

interface CheckInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'checkin' | 'checkout';
  currentTime: string;
}

export function CheckInOutModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  currentTime,
}: CheckInOutModalProps) {
  const isCheckIn = type === 'checkin';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            {isCheckIn ? (
              <LogIn className="h-5 w-5" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
            <span>Confirm {isCheckIn ? 'Check In' : 'Check Out'}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isCheckIn ? 'check in' : 'check out'} at{' '}
            {currentTime}?
            {isCheckIn && ' This will mark the start of your work day.'}
            {!isCheckIn && ' This will mark the end of your work day.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm {isCheckIn ? 'Check In' : 'Check Out'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
