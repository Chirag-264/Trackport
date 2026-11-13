import api from "./api";

export async function getTasks(params = {}) {
    const response = await api.get("/tasks", { params });
    return response.data;
}

export async function getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
}

export async function createTask(taskData) {
    const response = await api.post("/tasks", taskData);
    return response.data;
}

export async function updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
}

export async function deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
}

export async function reorderTasks(tasks) {
    const response = await api.put("/tasks/reorder", { tasks });
    return response.data;
}

