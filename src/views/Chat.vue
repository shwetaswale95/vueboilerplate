<template>
  <div id="app" class="chat-div">
    <h1>Real-Time Chat App</h1>
    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <template v-for="(msg, index) in messages" :key="index">
          <!-- Date Separator -->
          <div v-if="isNewDate(index)" class="date-separator">
            {{ formatDate(msg.timestamp) }}
          </div>
          <!-- Chat Message -->
          <div
            :class="{
              'message-sent': msg.user === username,
              'message-received': msg.user !== username,
            }"
          >
            <p class="message-text">
              <strong v-if="msg.user !== username">{{ msg.user }}:</strong>
              {{ msg.text }}
            </p>
            <p class="message-timestamp">
              {{
                new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </p>
          </div>
        </template>
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
      username: null, // Generate random username
    };
  },
  methods: {
    // Method to send the message
    sendMessage() {
      const messageData = {
        user: this.username,
        text: this.message,
        timestamp: new Date().toISOString(),
      };

      // Emit the message to the server
      this.socket.emit("send_message", messageData);

      // Add the message to the local messages list
      this.messages.push(messageData);

      // Clear input field
      this.message = "";
      this.scrollToBottom();
    },
    isNewDate(index) {
      if (index === 0) return true;

      const prevDate = new Date(this.messages[index - 1].timestamp).toDateString();
      const currDate = new Date(this.messages[index].timestamp).toDateString();

      return prevDate !== currDate;
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
  },
  mounted() {
    // Check if username exists in localStorage
    const savedUsername = localStorage.getItem("username");
    this.username = savedUsername || `User${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem("username", this.username);

    // Connect to the backend
    this.socket = io("http://localhost:3001");

    // Listen for incoming messages from the server
    this.socket.on("receive_message", (data) => {
      this.messages.push(data);
      this.scrollToBottom();
    });

    // Load all previous messages from the server
    this.socket.on("load_messages", (messages) => {
      this.messages = messages;
      this.scrollToBottom();
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
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 400px; /* Set a fixed height */
  overflow-y: auto; /* Enable scrolling */
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #ffffff;
}

.message-sent,
.message-received {
  display: inline-block;
  max-width: 70%;
  margin: 5px 0;
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
}

.message-sent {
  background-color: #d1ffc6; /* Light green */
  align-self: flex-end; /* Align on the right */
  color: #000;
}

.message-received {
  background-color: #f0f0f0; /* Light gray */
  align-self: flex-start; /* Align on the left */
  color: #000;
}
.message-text {
  font-size: 14px;
  margin: 0;
}

.message-timestamp {
  font-size: 10px;
  color: gray;
  text-align: right;
  margin-top: 4px;
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

.date-separator {
  text-align: center;
  margin: 10px 0;
  color: gray;
  font-size: 12px;
  font-weight: bold;
}
</style>
