import styled from "styled-components";
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { useState } from "react";

function Form() {

    const [roomID, setRoomID] = useState("");

    const handleRoomIDChange = () => {
        console.log("Room ID changed", roomID);
        window.location.href = `/${roomID}`;
    }

  return (
    <Container>
      <div>
        <HStack>
          <PinInput value={roomID} onChange={setRoomID} type="alphanumeric">
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
      </div>
      <button onClick={handleRoomIDChange} >Join</button>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  /* background-color: red;s */
  display: flex;
  gap: 10px;
  justify-content: center;

  div {
    /* background-color: rgba(246, 246, 246, 0.1); */
  }

    button {
        background-color: black;
        color: white;
        padding: 8px 20px;
        border: none;
        border-radius: 0.375rem;
    }

`;

export default Form;
