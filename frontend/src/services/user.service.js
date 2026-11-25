import api from './api';

export async function updateProfile(profile) {
  const response = await api.put('/users/me', profile);
  return response.data;
}

export async function updateDailyGoal(dailyGoal) {
  const response = await api.put('/users/me/goal', { dailyGoal });
  return response.data;
}

