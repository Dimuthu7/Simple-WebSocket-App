import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  // Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message_p, setMessage_p] = useState("");
  const [messageReceived_p, setMessageReceived_p] = useState("");

  const [message_b, setMessage_b] = useState("");
  const [messageReceived_b, setMessageReceived_b] = useState("");

  useEffect(() => {
    // Listen for events that are emitted by the server. 
    // In here listen receive_private_message & receive_broadcast_message events.
    socket.on("receive_private_message", (data) => {
      setMessageReceived_p(data.message_p);
    });

    socket.on("receive_broadcast_message", (data) => {
      setMessageReceived_b(data.message_b);
    });
  }, [socket]);

  const joinRoom = () => {
    if (room !== "") {
      
      // Emit join_room event to the server.
      socket.emit("join_room", room);
    }
  };

  const sendPrivateMessage = () => {
    socket.emit("send_private_message", { message_p, room });
  };

  const sendBroadcastMessage = () => {
    socket.emit("send_broadcast_message", { message_b });
  };

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join Room</button>
      <br />
      <br />

      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage_p(event.target.value);
        }}
      />
      <button onClick={sendPrivateMessage}>Send Private Message</button>
      <h1> Private Message:</h1>
      {messageReceived_p}
      <br />
      <br />

      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage_b(event.target.value);
        }}
      />
      <button onClick={sendBroadcastMessage}>Send Broadcast Message</button>
      <h1> Broadcast Message:</h1>
      {messageReceived_b}
    </div>
  );
}

export default App;
