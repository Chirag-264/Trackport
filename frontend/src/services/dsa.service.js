import api from './api';

export async function getDsaProgress(params = {}) {
  const response = await api.get('/dsa', { params });
  return response.data;
}

export async function createDsaProblem(problem) {
  const response = await api.post('/dsa/problems', problem);
  return response.data;
}

export async function deleteDsaProblem(id) {
  const response = await api.delete(`/dsa/problems/${id}`);
  return response.data;
}

export async function syncLeetCodeSolved(options = {}) {
  const response = await api.post('/dsa/leetcode/sync', options);
  return response.data;
}

export async function updateDsaDailyProgress(completedCount, timezone) {
  const response = await api.put('/dsa/daily-progress', { completedCount, timezone });
  return response.data;
}
