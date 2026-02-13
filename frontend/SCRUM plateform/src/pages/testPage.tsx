import { useEffect, useState } from "react";
import { getMe } from "../services/api";
import { useNavigate } from "react-router-dom";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            const data = await getMe(token);

            if (!data.firstName) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setUser(data);
        };

        fetchUser();
    }, [navigate]);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome, { user.firstName } </h1>
        </div>
    );
}
