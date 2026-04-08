import { useEffect, useState } from "react";
import gsap from "gsap";
import { API_BASE_URL } from "../../API";

const UpdateComplaint = ({ onClose, complaint, onUpdateSuccess }) => {
    const [status, setStatus] = useState(complaint.complaint_status);

    useEffect(() => {
        gsap.to(".vignette-trans", {
            opacity: 1,
            duration: 0.3
        })

        gsap.to(".backpack-display", {
            translateY: 0,
            duration: 0.3,
            scale: 1
        })

        const eventListener = window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                handleCloseTransition();
            }
        });

        return () => window.removeEventListener("keydown", eventListener);
    }, [])

    const handleCloseTransition = () => {
        gsap.to(".vignette-trans", {
            opacity: 0,
            duration: 0.3
        })

        gsap.to(".backpack-display", {
            translateY: 100,
            duration: 0.3
        })

        setTimeout(() => {
            onClose()
        }, 300);
    }

    const submitData = () =>  {
        console.log(complaint)
        fetch(`${API_BASE_URL}/api/complaint/${complaint.complaint_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}`,
            },
            body: JSON.stringify({
                complaint_status: status
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) { 
                handleCloseTransition();
            } else {
                console.error("Failed to update complaint:", data.error);
            }
        })
    }

    return (
        <div className="vignette w-screen h-screen absolute top-0 flex items-center justify-center vignette-trans opacity-0">
            <div className="w-1/3 h-auto rounded-md border-main bg-white relative backpack-display translate-y-32 scale-110">
                <div className="flex items-center rounded-t-md bg-zinc-300 p-2 absolute top-0 w-full z-10">
                    <h1 className="pl-4 poppins-bold pr-12">Muuda kaebuse staatust</h1>
                    <button onClick={handleCloseTransition} className="absolute right-0 p-2 pl-3 pr-3 rounded-tr-md hover:bg-red-500">X</button>
                </div>

                <div className="p-8 pt-16">
                    <p className="poppins-regular">Kaebus: <span className="poppins-bold">{complaint.type}</span></p>
                    <p className="poppins-regular">Kirjeldus: <span className="poppins-bold">{complaint.reasoning}</span></p>
                    <div className="mt-4">
                        <label htmlFor="status-select" className="poppins-bold">Staatuse muutmine:</label>
                        <select id="status-select" value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded-md border-main w-full mt-2">
                            <option value="saadetud">Saadetud</option>
                            <option value="tegutseme">Tegutseme</option>
                            <option value="lahendatud">Lahendatud</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <button onClick={submitData} className="rounded-md bg-green-500 text-white px-4 py-2 poppins-regular">Salvesta</button>
                        <button onClick={handleCloseTransition} className="rounded-md bg-gray-300 px-4 py-2 poppins-regular">Tühista</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateComplaint;
