import React, { useEffect, useRef, useState } from "react";
import { LuLink } from "react-icons/lu";
import { IoMdList } from "react-icons/io";
import { MdSubtitles, MdClose, MdCheck } from "react-icons/md";

export function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [editTitle, setEditTitle] = useState(false);
  const [showLinkCustomizer, setShowLinkCustomizer] = useState(false)
  const [showContentEditable, setShowContentEditable] = useState(false)

  const openContentEditable = () => {
    setShowContentEditable(true)
  }

  const closeContentEditable = () => {
    setShowContentEditable(false)
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

      if (isEditable) {
        customizedLink.onclick = (e) => {
          e.preventDefault();
          alert(`Link: ${linkElement.href}\nTexto: ${linkElement.textContent}`);
        };
      }

      contentElement.appendChild(customizedLink);
      contentElement.appendChild(document.createTextNode(" "));

      setUrl("");
      setLinkText("");
      setShowLinkCustomizer(false);
      contentElement.focus()
    }
  };

  const addTitle = () => {
    console.log(title)
    if (title !== "") {
      localStorage.setItem('title', title)
      setEditTitle(false)
    }
    // if (title !== "" && localStorage.getItem('title')) {
    //   localStorage.setItem('title', title)
    //   setEditTitle(false)
    // } 
  }

  const saveCardContent = () => {
    const contentElement = contentRef.current;
    if (contentElement) {
      const cardData = {
        title,
        content: contentElement.innerHTML,
      }

      console.log(cardData)
    }
  }

  const clearStoragedTitle = () => {
    setTitle("")
    localStorage.removeItem('title')
  }
  
  const handleClickOutside = (event: MouseEvent) => {
    console.log('ta entrando na função?')
    const contentElement = contentRef.current;
    const inputElement = document.querySelector("#input-container");
    
    if (contentElement || inputElement) {
      if (!contentElement?.contains(event.target as Node) && !inputElement?.contains(event.target as Node)) {
        console.log('se tiver entrando, ta passando por aqui?')
        setIsEditable(false);
      }
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
  }, [isEditable]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const title = localStorage.getItem('title')
    if (title) {
      setTitle(title)
    }
  }, [title])

  return (
    <div className="p-8 relative bg-[#1a1d21] h-screen text-[#b6b2cf]">
      <div className="absolute w-[700px] shadow-xl py-6 px-8 rounded-lg bg-[#323940]">
        <div className="flex w-full">
          <MdSubtitles size={24} className="mr-4 mt-2" />
          <div className="w-full">
            <div className="p-1 mb-4 flex w-full rounded-sm overflow-hidden">
              <input
                type="text"
                className={
                  `rounded-sm resize-none outline-none 
                  ${title.length >= 1 ? 'w-[85%]' : 'w-full'} 
                  bg-[#323940] text-2xl font-bold h-9 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500`
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Defina um título para o card"
              />
              {localStorage.getItem('title') && (
                <button>Editar</button>
              )}
              {/* {title.length >= 1 && (
                <div className="w-[15%] flex gap-1 ml-1">
                  <button 
                    className="bg-slate-400 rounded-sm h-full w-1/2 flex justify-center items-center"
                    onClick={addTitle}
                  >
                    <MdCheck color="#0aaf0d" size={20} />
                  </button>
                  <button 
                    onClick={clearStoragedTitle}
                    className="bg-slate-400 rounded-sm h-full w-1/2 flex justify-center items-center"
                  >
                    <MdClose color="#ff0000" size={20} />
                  </button>
                </div>
              )} */}
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <IoMdList size={24} className="mt-1 mr-4" />
          <h3 className="font-semibold mb-4">Descrição</h3>
        </div>
        <div className="ml-10 relative">
          {showContentEditable ? (
            <>
              <div
                className="rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabIndex={0}
              >
                <header className="bg-[#15191d] h-12 flex items-center">
                  <div className="p-2 cursor-pointer">
                    <LuLink onClick={toggleLinkCustomizer} size={20} className="font-normal" />
                  </div>
                </header>
                {showLinkCustomizer && (
                  <div
                    className="bg-[#1b2024] flex flex-col gap-3 rounded-md shadow-2xl absolute top-1/3 left-1/2 z-10 mb-3 px-8 py-4 w-[350px]"
                    id="input-container"
                  >
                    <div className="flex flex-col mb-4">
                      <label htmlFor="text-label" className="mb-2">
                        Cole um link
                      </label>
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
                      <label htmlFor="link" className="mb-2">
                        Personalize o título do link
                      </label>
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
                    <div className="flex justify-end gap-2 w-full pt-4">
                      <button onClick={toggleLinkCustomizer} className="px-4 py-2">
                        Cancelar
                      </button>
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
                  className="focus:outline-none focus:ring-blue-500 focus:border-[3px] focus:border-blue-500"
                  style={{
                    padding: "10px 20px",
                    minHeight: "150px",
                    cursor: "text",
                    backgroundColor: "#22282d",
                    outline: "none",
                    height: "300px",
                  }}
                  suppressContentEditableWarning={true}
                  contentEditable={isEditable}
                ></div>
              </div>
              <div className="flex justify-end gap-2 w-full pt-4">
                <button onClick={closeContentEditable} className="px-4 py-2">
                  Cancelar
                </button>
                <button
                  onClick={saveCardContent}
                  className="bg-slate-400 text-[#22282d] px-4 py-2 rounded-md font-semibold"
                >
                  Salvar
                </button>
              </div>
            </>
          ) : (
            <p onClick={openContentEditable} className="mt-4 cursor-pointer">
              Defina um assunto para o card
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
