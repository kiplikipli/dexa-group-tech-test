import * as dayjs from 'dayjs';

export type TFindAttendancesFilter = {
  id?: number;
  employeeId?: number;
  checkInTime?: {
    from: dayjs.Dayjs;
    to: dayjs.Dayjs;
  };
  checkOutTime?: {
    from: dayjs.Dayjs;
    to: dayjs.Dayjs;
  };
  totalWorkingSeconds?: {
    min: number;
    max: number;
  };
  limit?: number;
  offset?: number;
};
