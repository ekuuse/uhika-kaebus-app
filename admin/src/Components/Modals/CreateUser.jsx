import { useEffect, useState } from "react";
import gsap from "gsap";
import { API_BASE_URL } from "../../API";

const CreateUser = ({ onClose, onUserCreated }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [status, setStatus] = useState("pending");

    useEffect(() => {
        gsap.to(".vignette-trans", { opacity: 1, duration: 0.3 });
        gsap.to(".backpack-display", { translateY: 0, duration: 0.3, scale: 1 });

        const handleKeyDown = (e) => e.key === "Escape" && handleCloseTransition();
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleCloseTransition = () => {
        gsap.to(".vignette-trans", { opacity: 0, duration: 0.3 });
        gsap.to(".backpack-display", { translateY: 100, duration: 0.3 });
        setTimeout(onClose, 300);
    };

    const submitData = () => {
        fetch(`${API_BASE_URL}/api/admin/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}`,
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role,
                status,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                onUserCreated(data.user);
                handleCloseTransition();
            } else {
                console.error("Failed to create user:", data.error);
            }
        });
    };

    return (
        <div className="vignette w-screen h-screen absolute top-0 flex items-center justify-center vignette-trans opacity-0">
            <div className="w-1/3 h-auto rounded-md border-main bg-white relative backpack-display translate-y-32 scale-110">
                <div className="flex items-center rounded-t-md bg-zinc-300 p-2 absolute top-0 w-full z-10">
                    <h1 className="pl-4 poppins-bold pr-12">Loo uus kasutaja</h1>
                    <button onClick={handleCloseTransition} className="absolute right-0 p-2 pl-3 pr-3 rounded-tr-md hover:bg-red-500">X</button>
                </div>
                <div className="p-8 pt-16 flex flex-col gap-4">
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="p-2 rounded-md border-main" placeholder="Eesnimi" />
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="p-2 rounded-md border-main" placeholder="Perekonnanimi" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 rounded-md border-main" placeholder="Email" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 rounded-md border-main" placeholder="Parool" />
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 rounded-md border-main">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded-md border-main">
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button onClick={submitData} className="rounded-md bg-acent px-2 py-1 mt-4"><h1 className="poppins-regular">Loo kasutaja</h1></button>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
