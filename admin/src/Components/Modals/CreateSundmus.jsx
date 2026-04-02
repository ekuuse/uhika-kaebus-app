import { useEffect } from "react";
import gsap from "gsap";

const CreateEvent = ({ onClose }) => {

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

    return (
        <div className="vignette w-screen h-screen absolute top-0 flex items-center justify-center vignette-trans opacity-0">
            <div className="w-1/3 h-2/3 rounded-md border-main bg-white relative backpack-display translate-y-32 scale-110">
                <div className="flex items-center rounded-t-md bg-zinc-300 p-2 absolute top-0 w-full z-10">
                    <h1 className="pl-4 poppins-bold pr-12">Loo sündmus</h1>
                    <div className="px-24">{}</div>
                    <button onClick={handleCloseTransition} className="absolute right-0 p-2 pl-3 pr-3 rounded-tr-md hover:bg-red-500">X</button>
                </div>

                <div className="overflow-y-scroll h-full pt-10 ">
                    <div class="p-8 flex flex-col gap-4">
                        <input class="p-2 rounded-md border-main" placeholder="Nimi"></input>
                        <textarea class="p-2 rounded-md border-main" placeholder="Kirjeldus"></textarea>
                        <select class="p-2 rounded-md border-main">
                            <option>Idk 1</option>
                            <option>Idk 2</option>
                        </select>
                        <input type="date" class="p-2 rounded-md border-main" placeholder="Aeg"></input>
                        <button class="rounded-md bg-acent px-2 py-1 mt-4"><h1 class="poppins-regular">Loo</h1></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateEvent;