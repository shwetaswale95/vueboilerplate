<template>
  <div style="margin-top: 100px;">
    <h1>Video Call</h1>
    <div v-if="incomingCall">
      <p>You have an incoming call from {{ callerId }}</p>
      <button @click="acceptCall">Accept</button>
      <button @click="rejectCall">Reject</button>
    </div>
    <div v-else>
      <video id="localVideo" autoplay playsinline></video>
      <video id="remoteVideo" autoplay playsinline></video>
    </div>
    <div>
      <label for="recipientUserId">Recipient User ID:</label>
      <input v-model="recipientUserId" id="recipientUserId" placeholder="Enter User ID" />
      <button @click="startCall">Start Call</button>
    </div>
    <p>Your User ID: {{ userId }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      peerConnection: null,
      recipientUserId: "", // Target user ID for the call
      incomingCall: false, // Show incoming call UI
      callerId: null, // ID of the caller
      userId: null, // Current user's unique ID
    };
  },
  mounted() {
    // Assign a unique ID to the current browser session
    if (!localStorage.getItem("userId")) {
      const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", userId);
    }

    // Register the user ID with the server
    this.userId = localStorage.getItem("userId");
    this.$socket.emit("register_user", this.userId);  // Change to 'register_user'

    // Log socket events for debugging
    this.$socket.on("connect", () => {
      console.log("Socket connected:", this.$socket.id);
    });

    this.$socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });

    this.$socket.on("call-offer", this.handleCallOffer);
    this.$socket.on("call-answer", this.handleCallAnswer);
    this.$socket.on("ice-candidate", this.handleIceCandidate);
    this.$socket.on("call-reject", this.handleCallReject);
  },
  methods: {
    async startCall() {
      try {
        console.log("Starting call...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Local stream created:", stream);
        document.getElementById("localVideo").srcObject = stream;

        this.peerConnection = new RTCPeerConnection();
        console.log("Peer connection created:", this.peerConnection);

        stream.getTracks().forEach((track) => this.peerConnection.addTrack(track, stream));

        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('New ICE candidate:', event.candidate);
            this.$socket.emit("ice-candidate", {
              to: this.recipientUserId,
              candidate: event.candidate,
            });
          }
        };

        this.peerConnection.ontrack = (event) => {
          console.log('Received track:', event.streams);
          document.getElementById("remoteVideo").srcObject = event.streams[0];
        };

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        console.log("Offer created:", offer);
        this.$socket.emit("call-offer", {
          from: this.userId,
          to: this.recipientUserId,
          offer,
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Could not access your camera or microphone. Please close other tabs or apps using these devices.");
      }
    },
    handleCallOffer(data) {
      console.log("Received call offer from:", data.from);
      this.incomingCall = true;
      this.callerId = data.from;
    },
    async acceptCall() {
      this.incomingCall = false;
      try {
        console.log("Accepting call...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Local stream created:", stream);
        document.getElementById("localVideo").srcObject = stream;

        this.peerConnection = new RTCPeerConnection();
        console.log("Peer connection created:", this.peerConnection);

        stream.getTracks().forEach((track) => this.peerConnection.addTrack(track, stream));

        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('New ICE candidate:', event.candidate);
            this.$socket.emit("ice-candidate", {
              to: this.callerId,
              candidate: event.candidate,
            });
          }
        };

        this.peerConnection.ontrack = (event) => {
          console.log('Received track:', event.streams);
          document.getElementById("remoteVideo").srcObject = event.streams[0];
        };

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        console.log("Answer created:", answer);
        this.$socket.emit("call-answer", {
          to: this.callerId,
          answer,
        });
      } catch (error) {
        console.error("Error accepting call:", error);
        alert("Could not access your camera or microphone. Please close other tabs or apps using these devices.");
      }
    },
    rejectCall() {
      console.log("Rejecting call...");
      this.$socket.emit("call-reject", { to: this.callerId });
      this.incomingCall = false;
      this.callerId = null;
    },
    async handleCallAnswer(data) {
      console.log("Received call answer.");
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    },
    async handleIceCandidate(data) {
      if (data.candidate) {
        console.log("Adding ICE candidate:", data.candidate);
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    },
    handleCallReject() {
      console.log("Call rejected.");
      alert("Call was rejected.");
      this.peerConnection.close();
      this.peerConnection = null;
    },
  },
};
</script>

<style>
video {
  width: 300px;
  height: 200px;
  border: 1px solid black;
}
</style>
