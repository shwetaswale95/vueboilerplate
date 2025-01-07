<template>
  <div id="app" class="chat-div">
    <h1>Real-Time Chat App</h1>
    <div class="chat-container">
      <div class="messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="{
            'message-sent': msg.user === username,
            'message-received': msg.user !== username,
          }"
        >
          <p>
            <strong v-if="msg.user !== username">{{ msg.user }}:</strong>
            {{ msg.text }}
          </p>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="chat-form">
        <input
          v-model="message"
          type="text"
          placeholder="Type your message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      messages: [], // Store chat messages
      message: "", // Input field binding
      username: `User${Math.floor(Math.random() * 1000)}`, // Generate random username
    };
  },
  methods: {
    // Method to send the message
    sendMessage() {
      if (!this.message.trim()) return; // Ignore empty messages

      const messageData = {
        user: this.username,
        text: this.message,
      };
      console.log(this.username, "USERNAME");
      // Emit the message to the server
      this.socket.emit("send_message", messageData);

      // Add the message to the local messages list
      this.messages.push(messageData);

      // Clear input field after sending the message
      this.message = "";
    },
  },
  mounted() {
    // Connect to the backend (Socket.io server)
    this.socket = io("http://localhost:3001");

    // Listen for messages from the server
    this.socket.on("receive_message", (data) => {
      this.messages.push(data); // Add the received message to the messages array
    });
  },
};
</script>

<style>
.chat-div {
  margin-top: 100px;
}

.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.messages {
  max-height: 400px;
  overflow-y: scroll;
  margin-bottom: 20px;
}

.message-sent {
  text-align: right;
  background-color: #d3ffd3;
  padding: 5px 10px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.message-received {
  text-align: left;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.chat-form {
  display: flex;
  gap: 10px;
}

.chat-form input {
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.chat-form button {
  padding: 10px 15px;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.chat-form button:hover {
  background-color: #45a049;
}
</style>
