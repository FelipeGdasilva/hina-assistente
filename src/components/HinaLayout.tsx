'use client';
import ChatHina from "./ChatHina";

export default function HinaLayout(){
    return(
        <main  className="min-h-screen flex justify-center items-center bg-linear-to-br from-purple-500 to-cyan-700 flex-col ">
            <h1 className=" text-4xl text-white font-bold ">Hina ✨</h1>
                <ChatHina />
             </main>
    )
}