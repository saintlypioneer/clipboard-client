import styled from "styled-components";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const url = window.location.href.split("/");
  const roomId = url[url.length - 1];

  const [clipboard, setClipboard] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://clipboard-server-cr5j5yn2ca-uc.a.run.app", {
      query: { roomId: roomId },
    });

    newSocket.on("paste", ({ text }) => {
      console.log(`Received 'paste' event with text: ${text}`);
      setClipboard(text);
      setIsButtonDisabled(false);
    });

    setSocket(newSocket);

    // Clean up by disconnecting the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs once when component mounts

  const handlePasteFromClipboard = async () => {
    console.log("Attempting to read from clipboard.");
    // this function will read the clipboard and set it
    navigator.clipboard
      .readText()
      .then((text) => {
        console.log("Read from clipboard:", text);
        setClipboard(text);
        socket && socket.emit("copy", text);
        setPasteSuccess(true);
        setIsButtonDisabled(false);
        setTimeout(() => setPasteSuccess(false), 1000);
      })
      .catch((err) => {
        console.log("Something went wrong", err);
        window.alert("Access to clipboard is denied!");
      });
  };

  useEffect(() => {
    if (clipboard !== "") {
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 1000);
    }
  }, [clipboard]);

  const copyToClipboard = async () => {
    // this function will paste text content to the clipboard
    navigator.clipboard
      .writeText(clipboard)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000);
        console.log("Text copied to clipboard");
        console.log(clipboard);
      })
      .catch((err) => {
        console.log("Something went wrong", err);
        window.alert("Access to clipboard is denied!");
      });
  };

  return (
    <Container>
      <div id="center">
        <h1>Clip-Me</h1>
        <div id="buttons">
          <button
            onClick={copyToClipboard}
            className={`${isButtonDisabled ? "disabled" : ""} ${
              copySuccess ? "bg-green" : "bg-black"
            }`}
          >
            <span>Copy</span>
            <img src="/assets/svg/copy.svg" />
          </button>

          <button
            onClick={handlePasteFromClipboard}
            className={`${pasteSuccess ? "bg-green" : "bg-black"}`}
          >
            <span>Paste</span>
            <img src="/assets/svg/paste.svg" />
          </button>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: hsla(197, 100%, 63%, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  #center {
    background-color: rgba(246, 246, 246, 0.19);
    padding: 50px 10px;
    border-radius: 16px;
    width: 350px;

    h1 {
      font-style: normal;
      font-weight: 600;
      font-size: 64px;
      text-align: center;
      margin-bottom: 20px;
    }

    #buttons {
      display: flex;
      gap: 10px;
      align-items: center;

      button {
        flex: 1;
        background-color: black;
        color: white;
        display: flex;
        align-items: center;
        padding: 8px 10px;
        border-radius: 8px;
        transition: background-color 0.3s ease-in-out;

        &.bg-green {
          background-color: green;
        }

        &.bg-black {
          background-color: black;
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        span {
          flex: 1;
        }

        img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  background: linear-gradient(
    0deg,
    hsla(197, 100%, 63%, 1) 0%,
    hsla(294, 100%, 55%, 1) 100%
  );

  background: -moz-linear-gradient(
    0deg,
    hsla(197, 100%, 63%, 1) 0%,
    hsla(294, 100%, 55%, 1) 100%
  );

  background: -webkit-linear-gradient(
    0deg,
    hsla(197, 100%, 63%, 1) 0%,
    hsla(294, 100%, 55%, 1) 100%
  );

  filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#40C9FF", endColorstr="#E81CFF", GradientType=1 );
`;

export default App;
