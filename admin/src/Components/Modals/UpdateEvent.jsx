import { useEffect, useState } from "react";
import gsap from "gsap";
import { API_BASE_URL } from "../../API";

const UpdateEvent = ({ onClose, event }) => {
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [location, setLocation] = useState(event.location);
    const [date, setDate] = useState(new Date(event.date).toISOString().slice(0, 16));
    const [image, setImage] = useState(event.image);

    useEffect(() => {
        console.log(event)
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
        fetch(`${API_BASE_URL}/api/event/${event.event_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}`,
            },
            body: JSON.stringify({
                name,
                description,
                location,
                date,
                image
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            handleCloseTransition();
        })
    }

    return (
        <div className="vignette w-screen h-screen absolute top-0 flex items-center justify-center vignette-trans opacity-0">
            <div className="w-1/3 h-2/3 rounded-md border-main bg-white relative backpack-display translate-y-32 scale-110">
                <div className="flex items-center rounded-t-md bg-zinc-300 p-2 absolute top-0 w-full z-10">
                    <h1 className="pl-4 poppins-bold pr-12">Muuda üritust</h1>
                    <div className="px-24">{}</div>
                    <button onClick={handleCloseTransition} className="absolute right-0 p-2 pl-3 pr-3 rounded-tr-md hover:bg-red-500">X</button>
                </div>

                <div className="overflow-y-scroll h-full pt-10 ">
                    <div class="p-8 flex flex-col gap-4">
                        <input value={name} onChange={(e) => setName(e.target.value)} class="p-2 rounded-md border-main" placeholder="Nimi"></input>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} class="p-2 rounded-md border-main" placeholder="Kirjeldus"></textarea>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} class="p-2 rounded-md border-main" placeholder="Koht"></input>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} class="p-2 rounded-md border-main" placeholder="Aeg"></input>
                        <input value={image} onChange={(e) => setImage(e.target.value)} class="p-2 rounded-md border-main" placeholder="Pildi URL"></input>
                        <button onClick={() => submitData()} class="rounded-md bg-acent px-2 py-1 mt-4"><h1 class="poppins-regular">Salvesta muudatused</h1></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateEvent;
