import api from "./api";


async function getUserData() {
    const token = localStorage.getItem("token");

    const response = await api.get(
        "/dashboard",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response;
}

export default getUserData;