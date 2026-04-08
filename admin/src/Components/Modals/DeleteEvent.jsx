import { useEffect } from "react";
import gsap from "gsap";
import { API_BASE_URL } from "../../API";

const DeleteEvent = ({ onClose, event, onDeleteSuccess }) => {

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

    const deleteEvent = () =>  {
        fetch(`${API_BASE_URL}/api/event/${event.event_id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}`,
            }
        })
        .then(res => {
            if (res.ok) {
                onDeleteSuccess();
                handleCloseTransition();
            } else {
                // Handle error
                console.error("Failed to delete event");
            }
        })
    }

    return (
        <div className="vignette w-screen h-screen absolute top-0 flex items-center justify-center vignette-trans opacity-0">
            <div className="w-1/4 h-auto rounded-md border-main bg-white relative backpack-display translate-y-32 scale-110">
                <div className="flex items-center rounded-t-md bg-zinc-300 p-2 absolute top-0 w-full z-10">
                    <h1 className="pl-4 poppins-bold pr-12">Kustuta üritus</h1>
                    <button onClick={handleCloseTransition} className="absolute right-0 p-2 pl-3 pr-3 rounded-tr-md hover:bg-red-500">X</button>
                </div>

                <div className="p-8 pt-16">
                    <p className="poppins-regular text-center">Oled kindel, et soovid kustutada ürituse <span className="poppins-bold">{event.name}</span>?</p>
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={deleteEvent} className="rounded-md bg-red-500 text-white px-4 py-2 poppins-regular">Kustuta</button>
                        <button onClick={handleCloseTransition} className="rounded-md bg-gray-300 px-4 py-2 poppins-regular">Tühista</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteEvent;
