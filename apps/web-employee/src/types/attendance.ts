export type TAttendanceRecord = {
  id: number;
  employeeId: number;
  checkInTime: string;
  checkOutTime?: string;
  totalWorkingSeconds?: number;
};
