"use client";

import { Document, Page } from "react-pdf";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
import React, { Fragment, useState, useEffect } from "react";
// import "@/public/styles/chat.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import TextField from "../../components/TextField";
import ConversationDisplay from "../../components/ConversationDisplay";
import { supabase } from "../../utils/supabase";

// import { fileSizeLimit } from "@/util/fileSizeLimit";
// import { uploadLimit } from "@/util/uploadLimit";
// import { Button } from "@/components/ui/button";
// import PDFUpload from "@/components/PDF-upload";
// import ChatNav from "@/components/ChatNav";
// import {
//   conversationLogic,
//   useConversationLogic,
// } from "@/util/streaming/chat-util";
// import titleFixer, { isValidKey } from "@/util/titleFixer";

export default function chat() {
  const [conversation, setConversation] = useState([]);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPdf] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPdfId, setCurrentPdfId] = useState(null);
  const [chatId, setChatId] = useState("");
  const [userId, setUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState(null);
  const [fileOverLimit, setFileOverLimit] = useState(false);
  const [uploadCount, setUploadCount] = useState(null);
  const [showThinkingAnimation, setShowThinkingAnimation] = useState(false);
  const [duplicateFileError, setDuplicateFileError] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [isTextDisabled, setIsTextDisabled] = useState(true);
  const [currentResponse, setCurrentResponse] = useState("");
  const [processingPDF, setProcessingPDF] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  //   const convHistory = [];

  //   useConversationLogic(
  //     channelA,
  //     setShowThinkingAnimation,
  //     setCurrentResponse,
  //     setConversation,
  //     conversation
  //   );

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUserId(session.user.id);
      } catch (error) {}
    }
    getUser();
  }, []);

  function sendMessage() {}
  //   const sendMessage = async (messageText) => {
  //     setCurrentResponse("");
  //     client.removeChannel(channelA);

  //     // empty string is false in js
  //     if (!messageText.trim()) return;
  //     setConversation((conversation:) => [
  //       ...conversation,
  //       { type: "user", text: messageText },
  //     ]);
  //     convHistory.push(messageText);

  //     try {
  //       setShowThinkingAnimation(true);

  //       const response = await fetch("/api/llm", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           sessionId: userId,
  //           plan: plan,
  //           messageText: messageText,
  //           conv_history: convHistory,
  //           file_id: currentPdfId,
  //           // pages: numPages
  //         }),
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       return;
  //     }
  //   };

  const onFileSelect = async (event: any) => {
    event.stopPropagation();
    let filePath;
    let file_id;
    // let fsl = fileSizeLimit(plan); // fsl -> fileSizeLimit
    // let upl = uploadLimit(plan); // upl -> uploadLimit

    // check if both cases are true first

    console.log("userID is", userId);
    let fileObj = event.target.files[0];
    filePath = `${userId}/${fileObj.name}`;
    const { data, error } = await supabase.storage
      .from("pdfs")
      .upload(filePath, fileObj);
    file_id = data?.id;

    if (error) {
      console.log("ERRROR", error);

      setDuplicateFileError(true);
      // Handle error
      console.error(error.message);
      // closeModal();

      return;
    }

    try {
      setProcessingPDF(true);

      const formData = new FormData();
      // a web API that allows you to easily construct a set of key/value pairs representing form fields and their values
      formData.append("file", event.target.files[0]);
      formData.append("file_title", event.target.files[0].name);
      formData.append("file_id", file_id ?? "");
      // formData.append("userId", userId);

      const response = await fetch("/api/v1/parse", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        try {
          setProcessingPDF(false);
          // closeModal();
          setIsTextDisabled(false);
          const textResponse = await response.text(); // Read response as text

          // If you still need to parse JSON from the text
          try {
            const data = JSON.parse(textResponse); // Try parsing as JSON
            setCurrentPdfId(data.pdfIds);
            setChatId(data.chatId);
            // history.replaceState(data, "convo", `da/chat/${data.pdfIds}`);
            history.pushState(data, "convo", `chat/${data.pdfIds}`);

            // router.replace(`/chat/${data.pdfIds[0]}`, undefined, { shallow: true });
          } catch (jsonError) {
            console.error("Error parsing JSON from text: ", jsonError);
            // Handle case where text is not JSON
          }
        } catch (error) {
          setProcessingPDF(false);

          console.error("Error reading text response: ", error);
        }
      } else {
        setProcessingPDF(false);

        const { error: removeError } = await supabase.storage
          .from("pdfs")
          .remove([filePath]);

        if (removeError) {
          console.log(removeError);
        }

        // const result = await response.json();
      }
    } catch (error) {
      setProcessingPDF(false);

      console.error("error in chat page", error);
    }
  };

  //   function closeModal() {
  //     setDuplicateFileError(false);
  //     setIsOpen(false);
  //   }

  //   function openModal() {
  //     setIsOpen(true);
  //   }

  //   function showToast(title, desc) {
  //     toast(title, {
  //       description: desc,
  //       position: "top-right",

  //       action: {
  //         label: "Understood",
  //         onClick: () => console.log("Undo"),
  //       },
  //     });
  //   }

  //   return (
  //     <>
  //       <title>AskPDFs</title>

  //       {/* <ChatNav
  //         showBtn={true}
  //         btnTitle={t("myChats")}
  //         redirect="mychats"
  //         //  title={title}
  //       ></ChatNav> */}

  //       <div className="mx-12 mx-12 flex flex-col lg:grid lg:grid-cols-2">
  //         <div className="rounded-lg border-4  shadow5 ">
  //           {pdf ? (
  //             <div className=" p-12 bg-gray h-[800px] overflow-y-auto  ">
  //               <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
  //                 {Array.apply(null, Array(numPages))
  //                   .map((x, i) => i + 1)
  //                   .map((page) => {
  //                     return (
  //                       <Page
  //                         className="mb-12"
  //                         pageNumber={page}
  //                         renderTextLayer={false}
  //                         renderAnnotationLayer={false}
  //                       />
  //                     );
  //                   })}
  //               </Document>
  //             </div>
  //           ) : (
  //             <>
  //               <div className="flex justify-center mt-48">
  //                 {/* <PDFUpload openModal={openModal}></PDFUpload> */}
  //                 {/* <button data-testid="uploadPDF-btn" onClick={openModal}>
  //                   {t("message")}
  //                 </button> */}
  //               </div>

  //               <div className="flex justify-center mt-48">
  //                 {/* <Modal
  //                   processingPDF={processingPDF}
  //                   title={t("upload")}
  //                   isOpen={isOpen}
  //                   closeModal={closeModal}
  //                   openModal={openModal}
  //                   onFileSelect={onFileSelect}
  //                 ></Modal> */}
  //               </div>
  //             </>
  //           )}

  //           {pdf && (
  //             <p>
  //               Page {pageNumber} of {numPages}
  //             </p>
  //           )}
  //         </div>

  //         <div className="flex flex-col justify-between h-full">
  //           <div className="flex-grow overflow-y-auto">
  //             <ConversationDisplay
  //               isTextDisabled={isTextDisabled}
  //               processingPDF={processingPDF}
  //               showThinkingAnimation={showThinkingAnimation}
  //               conversation={conversation}
  //               sendMessage={sendMessage}
  //             />
  //             {/* <TextField
  //               isDisabled={processingPDF}
  //               onSendMessage={sendMessage}></TextField> */}
  //           </div>
  //         </div>

  //         {/* <div className="mt-4"></div> */}
  //       </div>
  //     </>
  //   );
  return (
    <>
      <div className="mx-12 flex flex-col lg:grid lg:grid-cols-2 gap-8 my-22 ">
        {/* Left Panel (PDF View) */}
        <div className="rounded-lg border-4 shadow-lg p-4">
          {pdf ? (
            <div className="p-8 bg-gray-100 overflow-y-auto">
              <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    className="mb-8"
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
              <p className="text-center mt-4 text-sm text-gray-600">
                Page {pageNumber} of {numPages}
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[800px]">
              <p className="text-gray-500">Upload a PDF to start chatting</p>

              <label className=" mt-3 custum-file-upload" for="file">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill=""
                    viewBox="0 0 24 24"
                  >
                    <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                    <g
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      id="SVGRepo_tracerCarrier"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill=""
                        d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
                <div className="text">
                  <span>Click to upload image</span>
                </div>

                <input
                  data-testid="pdf-modal"
                  size={100}
                  onChange={(event) => onFileSelect(event)}
                  type="file"
                  id="file"
                  accept="application/pdf"
                ></input>
              </label>
            </div>
          )}
        </div>

        {/* Right Panel (Chat) */}
        <div className="flex flex-col justify-between h-full">
          <div className="flex-grow overflow-y-auto">
            <ConversationDisplay
              isTextDisabled={isTextDisabled}
              processingPDF={processingPDF}
              showThinkingAnimation={showThinkingAnimation}
              conversation={conversation}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
