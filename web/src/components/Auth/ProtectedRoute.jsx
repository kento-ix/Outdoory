import { useAtom } from "jotai";
import { authTokenAtom } from "../../atoms/authAtoms";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const [authUser] = useAtom(authTokenAtom);

    return authUser ? <Outlet /> : <Navigate to="/" replace/>
};

export default ProtectedRoute;