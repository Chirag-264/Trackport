import api from "./api";

function loginUser(data) {
    return api.post('auth/login', data);
}

function registerUser(data) {
    return api.post('auth/register', data);
}

export {loginUser, registerUser};