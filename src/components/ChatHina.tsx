"use client";

interface Mensagem{
    id: number;
    text: string;
    sender: string;
}

import { useEffect, useRef, useState } from "react";


export default  function ChatHina(){
    const [pergunta, setPergunta] = useState("");
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const [mensagens,setMensagens] = useState<Mensagem[]>([]);
    const [senhaModoCriador, setSenhaModoCriador] = useState("");

    const handlekeyDom = (e: React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            lidarComEnvio();
        }
    };
    
    useEffect(() =>{
        chatEndRef.current?.scrollIntoView({behavior:"smooth"});
    }, [mensagens]);
    

    const lidarComEnvio = async (e?: React.SyntheticEvent) =>{
       if  (e) e.preventDefault();

        if(!pergunta.trim()) return;

        const textoDigitado = pergunta.trim();


        const novaMensagem = {id: Date.now(), text: pergunta, sender: "user"};
        setMensagens((prev) => [...prev, novaMensagem]);
        setPergunta("");
      
        try{
            const respostaAPI = await fetch("/api/chat", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({mensagens: [...mensagens, novaMensagem], senhaDigitada: senhaModoCriador || textoDigitado,}),
                
            });
            const data = await respostaAPI.json();

            if(!respostaAPI.ok){
                throw new Error(data.error || "Erro na API da Hina")
            }

            if(data.isCreator){
                setSenhaModoCriador(senhaModoCriador || textoDigitado);
            }

            setMensagens((prev) =>[
                ...prev,
                {id: Date.now() + 1, text: data.resposta, sender:"hina"},
            ]);
        }catch (error){
            console.log("Erro ao enviar mensagem:", error);
            setMensagens((prev)=>[
                ...prev,
                {id: Date.now() + 1, text:"Ops! tive um problema de conexão com meus sistemas. Tente novamente em instantes!",
                    sender: 'hina',
                }
            ])
        }
         
    };
    return(
        <div className="w-full max-auto max-w-md mt-8 px-4">
            <div className=" flex flex-col gap-4 w-full max-w-md max-auto mv-4 p-4">
                {mensagens.map((msg) =>  
                <div key={msg.id} className={`p-3 rounded-2xl ${msg.sender === "user" ? "bg-purple-600 self-end  text-white rounded-tr-none" : "bg-cyan-400 text-slate-950  self-start rounded-tl-none"}`}>
                <p className="text-sm">{msg.text}</p>
                </div>
                )}
                <div ref={chatEndRef}/>
            </div>
        
        <form  onSubmit={lidarComEnvio} className=" flex items-center gap-2 bg-slate-800/80 border border-purple-900/40 rounded-xl p-2 shadow-lg">
            <input type="text" placeholder="Bora conversar?" value={pergunta} onChange={e => setPergunta(e.target.value)} onKeyDown={handlekeyDom} className="flex-1  min-w-0 bg-transparent text-white placeholder:bg-purple-500/30 foucs:outline-none px-2"/>
            
             <button type="submit" className="bg-purple-600 shrink-0 hover:bg-purple-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors">
                Enviar
             </button>
            
        </form>
        </div>
    )
}