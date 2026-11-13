import api from "./api";

export async function getDashboardData() {
    const response = await api.get("/dashboard");
    return response.data;
}

export async function getGitHubStats(githubUrl) {
    const response = await api.get("/integrations/github", { params: { url: githubUrl } });
    return response.data;
}

export default getDashboardData;