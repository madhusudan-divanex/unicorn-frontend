import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { base_url } from "../baseUrl";
import { io } from "socket.io-client";
import { getSecureApiData, postApiData, securePostData } from "../services/api";

const socket = io(base_url)
const Chat = ({ show, handleClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const { userData, loading, error } = useSelector((state) => state.user);
  const [inputFile, setInputFile] = useState()
  const [inputFileName, setInputFileName] = useState()
  useEffect(() => {
    socket.emit("register", {
      userId: userData?._id,
      role: "user"
    });

    socket.on("receive-message", (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => socket.off("receive-message");
  }, []);
  const sendMessage = async () => {
    if (!inputMessage.trim() && !inputFile) return;

    let fileUrl = null;
    let fileType = null;

    //  file hai to upload karo
    if (inputFile) {
      const formData = new FormData();
      formData.append("file", inputFile);

      const res = await securePostData("upload-chat-file", formData);

      if (res.success) {
        fileUrl = res.fileUrl;
        fileType = inputFile.type;
      }
    }

    // Emit according to role
    socket.emit("user-message", {
      userId: userData?._id,
      message: inputMessage,
      fileUrl,
      fileType
    });

    // Instant UI update
    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        message: inputMessage,
        fileUrl,
        fileType,
        createdAt: new Date()
      }
    ]);

    setInputMessage("");
    setInputFile(null);
  };
  async function fetchUserChats() {
    if (!userData?._id) return;
    try {
      const res = await getSecureApiData(`chats/${userData?._id}`)
      if (res.success) {
        setMessages(res.data)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if (show) {

      fetchUserChats()
    }
  }, [show])
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  return (
    <div>
      {show && (
        <div className={`chat-card cht-crd-bx card position-fixed ${isMinimized ? "minimized" : ""}`}>
          {/* Header */}
          <div className="chat-header d-flex align-items-center">
            <img
              src="assets/images/chat.png"
              alt="bot"
              className="chat-avatar me-2"
            />
            <div>
              <div className="fw-bold">Unicorn Team</div>
              <small className="text-success">Support</small>
            </div>
            <div className="ms-auto d-flex align-items-center gap-2">
              <button
                className="header-btn"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? "▢" : "−"}
              </button>
              <button className="header-btn" onClick={() => handleClose()}>
                ✖
              </button>
            </div>
          </div>

          {/* Messages */}
          {show && (
            <>
              <div className="chat-body" ref={chatRef}>
                {messages.length === 0 && (
                  <div className="text-center text-muted mt-3">
                    No messages yet
                  </div>
                )}

                {messages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`d-flex mb-3 ${msg.sender === "user"
                      ? "justify-content-end"
                      : "justify-content-start"
                      } align-items-start`}
                  >
                    {msg.sender !== "user" && (
                      <img
                        src="assets/images/chat.png"
                        alt="admin"
                        className="chat-avatar me-2"
                      />
                    )}

                    <div
                      className={
                        msg.sender === "user"
                          ? "user-msg me-2"
                          : "bot-msg"
                      }
                    >
                      {msg.message}
                      {msg.fileUrl && (
                        <>
                          {msg.fileType?.startsWith("image") ? (
                            <img
                              src={`${base_url}${msg.fileUrl}`}
                              alt="file"
                              style={{ maxWidth: "200px", borderRadius: "8px" }}
                            />
                          ) : (
                            <a
                              href={`${base_url}${msg.fileUrl}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              📄 Download File
                            </a>
                          )}
                        </>
                      )}
                    </div>

                    {msg.sender === "user" && (
                      <img
                        src={
                          userData?.photo
                            ? `${base_url}/${userData?.photo}`
                            : "assets/images/chat-user.png"
                        }
                        alt="user"
                        className="chat-avatar"
                      />
                    )}
                  </div>
                ))}
              </div>
              {inputFile && (
                <div className="d-flex align-items-center gap-2">
                  <p className="mb-0">{inputFile.name}</p>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setInputFile(null)}
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="chat-footer">
                <div className="custom-frm-bx mb-0">
                  <input
                    type="file"
                    onChange={(e) => setInputFile(e.target.files[0])}
                    hidden
                    id="fileInput"
                  />
                  <button className="btn attach-btn" onClick={() => document.getElementById('fileInput')?.click()}>
                    <i className="fa-solid fa-paperclip"></i>
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="form-control chat-input"
                    placeholder="Write a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />

                  <button
                    className="btn send-btn"
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() && !inputFile}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;

