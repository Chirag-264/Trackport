const token = localStorage.getItem("token");

if (!token) {
    return <Navigate to="/auth/login" />;
}

return <Outlet />;