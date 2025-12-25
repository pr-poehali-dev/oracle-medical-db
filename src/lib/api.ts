const API_URL = 'https://functions.poehali.dev/b8956a54-a237-4eb9-8d75-29863542b448';

export const api = {
  async getStats() {
    const res = await fetch(`${API_URL}?endpoint=stats`);
    return res.json();
  },

  async getPatients(search = '') {
    const params = new URLSearchParams({ endpoint: 'patients', limit: '100' });
    if (search) params.append('search', search);
    const res = await fetch(`${API_URL}?${params}`);
    return res.json();
  },

  async createPatient(data: any) {
    const res = await fetch(`${API_URL}?endpoint=patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updatePatient(data: any) {
    const res = await fetch(`${API_URL}?endpoint=patients`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deletePatient(id: number) {
    const res = await fetch(`${API_URL}?endpoint=patients&id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async getAppointments(status = '') {
    const params = new URLSearchParams({ endpoint: 'appointments', limit: '100' });
    if (status) params.append('status', status);
    const res = await fetch(`${API_URL}?${params}`);
    return res.json();
  },

  async createAppointment(data: any) {
    const res = await fetch(`${API_URL}?endpoint=appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateAppointment(data: any) {
    const res = await fetch(`${API_URL}?endpoint=appointments`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAppointment(id: number) {
    const res = await fetch(`${API_URL}?endpoint=appointments&id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async getDoctors() {
    const res = await fetch(`${API_URL}?endpoint=doctors`);
    return res.json();
  },

  async getDepartments() {
    const res = await fetch(`${API_URL}?endpoint=departments`);
    return res.json();
  },

  async getServices() {
    const res = await fetch(`${API_URL}?endpoint=services`);
    return res.json();
  },

  async getDiagnoses() {
    const res = await fetch(`${API_URL}?endpoint=diagnoses`);
    return res.json();
  },
};
