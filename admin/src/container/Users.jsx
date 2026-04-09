import { useState, useEffect } from "react";
import { API_BASE_URL } from "../API";
import ModalManager from "../Components/Modals/ModalManager";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
    const [modalProps, setModalProps] = useState({});

    const fetchData = () => {
        fetch(`${API_BASE_URL}/api/admin/users`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUsers(data.users);
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteUser = (userId) => {
        if (window.confirm("Oled kindel, et soovid selle kasutaja kustutada?")) {
            fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUsers(users.filter(user => user.id !== userId));
                } else {
                    console.error("Failed to delete user:", data.error);
                }
            });
        }
    };

    const updateUser = (userId, field, value) => {
        fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}`
            },
            body: JSON.stringify({ [field]: value })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUsers(users.map(user => user.id === userId ? data.user : user));
            } else {
                console.error(`Failed to update ${field}:`, data.error);
            }
        });
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalProps({});
    };

    return (
        <div class="h-screen">
            <div class="px-32 py-16">
                <h1 class="hover:underline cursor-pointer" onClick={() => window.history.back()}>
                    {"< Tagasi"}
                </h1>
                <div class="flex gap-4">
                    <h1 class="poppins-bold text-4xl">Kasutajad</h1>
                    <button class="rounded-md bg-acent px-2 py-1 mt-1.5 items-center flex gap-2 h-8 cursor-pointer" onClick={fetchData}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 30 30">
                            <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
                        </svg><h1>Uuenda</h1>
                    </button>
                    <button class="rounded-md bg-acent px-2 py-1 mt-1.5 items-center flex gap-2 h-8 cursor-pointer" onClick={() => setActiveModal("createuser")}>
                        <h1>Lisa uus</h1>
                    </button>
                </div>
            </div>
            <div className="px-32">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-main">
                            <th className="poppins-bold p-2">ID</th>
                            <th className="poppins-bold p-2">Nimi</th>
                            <th className="poppins-bold p-2">Email</th>
                            <th className="poppins-bold p-2">Roll</th>
                            <th className="poppins-bold p-2">Staatus</th>
                            <th className="poppins-bold p-2">Tuba</th>
                            <th className="poppins-bold p-2">Tegevused</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-main">
                                <td className="p-2">{user.id}</td>
                                <td className="p-2">{user.first_name} {user.last_name}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">
                                    <select value={user.role} onChange={(e) => updateUser(user.id, 'role', e.target.value)} className="p-1 rounded-md border-main">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-2">
                                    <select value={user.status} onChange={(e) => updateUser(user.id, 'status', e.target.value)} className="p-1 rounded-md border-main">
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="denied">Denied</option>
                                    </select>
                                </td>
                                <td className="p-2">
                                    <input 
                                        type="number" 
                                        defaultValue={user.room_nr || ''} 
                                        onBlur={(e) => updateUser(user.id, 'room_nr', e.target.value ? parseInt(e.target.value) : null)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                updateUser(user.id, 'room_nr', e.target.value ? parseInt(e.target.value) : null);
                                                e.target.blur(); 
                                            }
                                        }}
                                        className="p-1 rounded-md border-main w-24" 
                                    />
                                </td>
                                <td className="p-2">
                                    <button onClick={() => deleteUser(user.id)} className="text-red-500 hover:underline">Kustuta</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModalManager modal={activeModal} modalProps={{ ...modalProps, onUserCreated: (newUser) => setUsers([...users, newUser]) }} onClose={closeModal} />
        </div>
    )
}

export default Users;