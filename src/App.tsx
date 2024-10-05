import React, { useEffect, useRef, useState } from "react";
import { LuLink } from "react-icons/lu";
import { IoMdList } from "react-icons/io";


export function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [showLinkCustomizer, setShowLinkCustomizer] = useState(false)
  const [showContentEditable, setShowContentEditable] = useState(false)

  const openContentEditable = () => {
    setShowContentEditable(true)
  }

  const toggleLinkCustomizer = () => {
    setShowLinkCustomizer(!showLinkCustomizer)
  }

  const linkCustomization = (linkElement: HTMLAnchorElement) => {
    linkElement.style.color = "blue";
    linkElement.style.textDecoration = "underline";
    linkElement.style.cursor = "pointer";
    return linkElement;
  };

  const createLink = (url: string, text: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.textContent = text || url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    return link;
  }

  const addLink = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const contentElement = contentRef.current;

    if (url && contentElement) {
      const linkElement = createLink(url, linkText);
      const customizedLink = linkCustomization(linkElement);

      // Atribua o comportamento do link com base no `isEditable`6
      if (isEditable) {
        // Se `isEditable` for `true`, impede navegação e exibe alerta
        customizedLink.onclick = (e) => {
          console.log('Comportamento editável ativado:', isEditable);
          e.preventDefault();
          alert(`Link: ${linkElement.href}\nTexto: ${linkElement.textContent}`);
        };
      } else {
        // Se `isEditable` for `false`, permite navegação normal
        customizedLink.onclick = null;
        console.log('Navegação normal permitida:', isEditable);
      }

      contentElement.appendChild(customizedLink);
      contentElement.appendChild(document.createTextNode(" "));

      setUrl("");
      setLinkText("");
      setShowLinkCustomizer(false);
      contentElement.focus()
    }
  };

  // Função para gerenciar cliques fora do conteúdo editável
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClickOutside = (event: MouseEvent) => {
    console.log('ta entrando na função?')
    const contentElement = contentRef.current;
    const inputElement = document.querySelector("#input-container");
    
    if (contentElement || inputElement) {
      // Se clicou fora do conteúdo e fora dos inputs, desativa edição
      if (!contentElement?.contains(event.target as Node) && !inputElement?.contains(event.target as Node)) {
        console.log('se tiver entrando, ta passando por aqui?')
        setIsEditable(false);
      }
      // Se clicou dentro do conteúdo (fora de links), ativa edição
      else if (!isEditable && !(event.target as Element)?.closest("a")) {
        console.log('ou ta passando por aqui?')
        setIsEditable(true);
      }
    }
  };

  // Atualiza o comportamento dos links quando `isEditable` muda
  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      // Seleciona todos os links dentro do conteúdo
      const links = contentElement.querySelectorAll("a");
      links.forEach((link) => {
        if (isEditable) {
          link.onclick = (e) => {
            e.preventDefault();
            alert(`Link: ${link.getAttribute("href")}\nTexto: ${link.textContent}`);
          };
        } else {
          link.onclick = null;
        }
      });
    }
  }, [isEditable]); // Reexecuta sempre que `isEditable` mudar

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="p-8 relative bg-[#1a1d21] h-screen text-[#b6b2cf]">
      <div className="absolute w-[700px] shadow-xl py-6 px-8 rounded-lg bg-[#323940]">
        <h2 className="text-2xl font-bold mb-6">Titulo do card</h2>
        {isEditable}
        <div className="flex items-start">
          <IoMdList size={24} className="mt-1 mr-4" />
          <h3 className="font-semibold mb-4">Descrição</h3>
        </div>
        <div className="ml-10 relative">
          {showContentEditable 
            ? (
              <div className="rounded-md overflow-hidden border-2">
                <header className="bg-[#15191d] h-12 flex items-center">
                  <div className="p-2 cursor-pointer">
                    <LuLink 
                      onClick={toggleLinkCustomizer}
                      size={20} 
                      className="font-normal" 
                    />
                  </div>
                </header>
                {showLinkCustomizer && (
                  <div className="bg-[#1b2024] flex flex-col gap-3 rounded-md shadow-2xl absolute top-1/3 left-1/2 z-10 mb-3 px-8 py-4 w-[350px]" id="input-container">
                    <div className="flex flex-col mb-4">
                      <label htmlFor="text-label" className="mb-2">Cole um link</label>
                      <input
                        type="text"
                        id="text-label"
                        placeholder="URL do link"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        style={{ marginRight: "5px" }}
                        className="bg-[#22282d] border h-10 p-2 rounded-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="link" className="mb-2">Personalize o título do link</label>
                      <input
                        type="text"
                        id="link"
                        placeholder="Texto do link"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        style={{ marginRight: "5px" }}
                        className="bg-[#22282d] border h-10 p-2 rounded-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2 w-full">
                      <button onClick={toggleLinkCustomizer} className="px-4 py-2">Cancelar</button>
                      <button 
                        onClick={addLink}
                        className="bg-slate-400 text-[#22282d] px-4 py-2 rounded-md font-semibold"
                      >
                        Adicionar Link
                      </button>
                    </div>
                  </div>
                )}

                <div
                  ref={contentRef}
                  style={{
                    border: "nome",
                    padding: "10px 20px",
                    minHeight: "150px",
                    cursor: "text",
                    backgroundColor: "#22282d",
                    outline: "none",
                    height: "300px"
                  }}
                  suppressContentEditableWarning={true}
                  contentEditable={isEditable}
                ></div>
              </div>
            ) 
            : <p onClick={openContentEditable} className="mt-4 cursor-pointer">
                Defina um assunto para o card
              </p>
          }
        </div>
      </div>
    </div>
  );
}
