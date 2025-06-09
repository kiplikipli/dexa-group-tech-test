import apiClient from '@/lib/apiClient';

export const attendanceService = {
  async getAttendances(params: {
    checkInTimeFrom?: string;
    checkInTimeTo?: string;
    checkOutTimeFrom?: string;
    checkOutTimeTo?: string;
  }) {
    const parsedParams = {
      checkInTimeFrom: params.checkInTimeFrom,
      checkInTimeTo: params.checkInTimeTo,
      checkOutTimeFrom: params.checkOutTimeFrom,
      checkOutTimeTo: params.checkOutTimeTo,
    };

    const res = await apiClient.get('/attendances', {
      params: parsedParams,
    });

    return res.data;
  },

  async checkIn() {
    const res = await apiClient.post('/attendances/check-in');

    return res.data;
  },

  async checkOut() {
    const res = await apiClient.post('/attendances/check-out');

    return res.data;
  },
};
