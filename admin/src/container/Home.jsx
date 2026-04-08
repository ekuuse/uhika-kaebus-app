import { useState } from "react";
import ModalManager from "../Components/Modals/ModalManager";
const Home = () => {

    const [activeModal, setActiveModal] = useState(null);
    const [modalProps, setModalProps] = useState({});

    const closeModal = () => {
        setActiveModal(null);
        setModalProps({});
    }

    return (
        <div>
            <div class="px-32 py-16">
                <h1 class="poppins-bold text-4xl">Admin page</h1>
            </div>
            <div class="flex justify-between gap-16 px-32">
                <div class="w-1/4">
                    <div class="flex justify-between">
                        <h1 class="poppins-bold">Üritused</h1>
                        <button class="rounded-md bg-acent px-2 py-1" onClick={() => setActiveModal("createevent")}><h1 class="poppins-regular">Lisa uus</h1></button>
                    </div>
                    <div class="bg-acent border-main rounded-md mt-4 relative options-hover-container">
                        <div class="p-4">
                            <h1 class="poppins-bold">Lauamängude õhtu</h1>
                            <p class="poppins-regular">Kopli, 4 korrus puhkeruum</p>
                            <h1 class="poppins-regular">Kolmapäev, 17:00</h1>
                        </div>

                        <div class="flex flex-col options-container">
                            <button class="border-main rounded-md">Muuda</button>
                            <button class="border-main rounded-md">Kustuta</button>
                        </div>
                    </div>
                </div>
                <div class="w-1/4">
                    <div class="flex justify-between">
                        <h1 class="poppins-bold">Sündmused</h1>
                        <button class="rounded-md bg-acent px-2 py-1"><h1 class="poppins-regular" onClick={() => setActiveModal("createsundmus")}>Lisa uus</h1></button>
                    </div>
                    <div class="bg-acent border-main rounded-md mt-4 relative options-hover-container">
                        <div class="p-4">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <circle cx="7" cy="7" r="7" fill="#8C8C8C" />
                                </svg>
                                <h1 class="poppins-regular">Homme, Teisipäev</h1>
                            </div>
                            <h1 class="poppins-bold">Koristuspäev</h1>
                        </div>

                        <div class="flex flex-col options-container">
                            <button class="border-main rounded-md">Muuda</button>
                            <button class="border-main rounded-md">Kustuta</button>
                        </div>
                    </div>
                </div>
                <div class="w-1/3">
                    <div class="flex justify-between">
                        <h1 class="poppins-bold">Kaebused</h1>
                    
                    </div>
                    <div class="bg-acent border-main rounded-md mt-4 relative options-hover-container">
                        <div class="p-4">
                            <div class="flex items-center gap-2">
                                <h1 class="poppins-bold">406A</h1>
                            </div>
                            <h1 class="poppins-regular">Kaebus: Lärm & Müra</h1>
                            <h1 class="poppins-regular">Kirjeldus: Tugev lärm mängub öösel</h1>
                            <h1 class="poppins-regular">Saatja: John Doe</h1>
                        </div>

                        <div class="flex flex-col options-container">
                            <button class="border-main rounded-md">Märgi lahendatuks</button>
                            <button class="border-main rounded-md">Kustuta</button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalManager modal={activeModal} modalProps={{ ...modalProps}} onClose={closeModal} />
        </div>
    )
}

export default Home;