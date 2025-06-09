import apiClient from '@/lib/apiClient';

export const employeeService = {
  async getEmployees() {
    const res = await apiClient.get('/employees');

    return res.data;
  },

  async getEmployeeByUserId(userId: number) {
    const res = await apiClient.get(`/employees/user/${userId}`);

    return res.data;
  },

  async createEmployee(data: Record<string, string | number>) {
    const payload = {
      job_title: data.jobTitle,
      name: data.name,
      phone: data.phone,
      email: data.email,
    };

    const res = await apiClient.post('/employees', payload);

    return res.data;
  },

  async updateProfile(data: Record<string, string | number>) {
    const payload = {
      job_title: data.jobTitle,
      name: data.name,
      phone: data.phone,
      email: data.email,
    };

    const res = await apiClient.put(`/employees/update-profile`, payload);

    return res.data;
  },
};
