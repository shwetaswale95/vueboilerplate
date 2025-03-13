<template>
  <div class="video-call" style="margin-top: 100px; text-align: center;">
    <h1>Video Call</h1>
    <p>Your User ID: <strong>{{ userId }}</strong></p>
    <div id="videos">
      <v-card class="video-card">
        <h3>📹 You</h3>
        <video ref="localVideo" autoplay muted></video>
      </v-card>
      <v-card class="video-card">
        <h3>👤 Caller</h3>
        <video ref="remoteVideo" autoplay></video>
      </v-card>
    </div>
    <div class="button-group">
      <v-btn rounded color="primary" @click="startCall">
        <v-icon left>mdi-phone</v-icon> Start Call
      </v-btn>
      <v-btn rounded color="success" @click="answerCall">
        <v-icon left>mdi-phone-incoming</v-icon> Answer Call
      </v-btn>
      <v-btn rounded color="error" @click="hangUp">
        <v-icon left>mdi-phone-hangup</v-icon> Hang Up
      </v-btn>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      localStream: null,
      remoteStream: new MediaStream(),
      peerConnection: null,
      userId: Math.random().toString(36).substring(7),
      currentCaller: null,
      iceCandidateQueue: [],
    };
  },
  methods: {
    async getMediaDevices() {
      if (this.localStream) return this.localStream;

      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (error) {
        console.warn("Camera unavailable, switching to audio-only mode:", error);
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      }

      return this.localStream;
    },

    async startCall() {
      const recipientId = prompt("Enter recipient ID:");
      if (!recipientId) return;

      this.currentCaller = recipientId;
      this.peerConnection = new RTCPeerConnection();
      this.setupPeerConnection();

      try {
        const stream = await this.getMediaDevices();
        this.$refs.localVideo.srcObject = stream;

        stream.getTracks().forEach(track => {
          const sender = this.peerConnection.getSenders().find(s => s.track?.kind === track.kind);
          if (sender) sender.replaceTrack(track);
          else this.peerConnection.addTrack(track, stream);
        });

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        this.socket.emit("call-offer", { from: this.userId, to: recipientId, offer });
      } catch (err) {
        console.error("Error starting call:", err);
      }
    },

    async answerCall() {
      if (!this.currentCaller) {
        alert("No incoming call to answer.");
        return;
      }

      if (!this.peerConnection) {
        console.error("No peer connection found!");
        return;
      }

      try {
        while (!this.peerConnection.remoteDescription) {
          console.log("Waiting for remote description to be set...");
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const stream = await this.getMediaDevices();
        this.$refs.localVideo.srcObject = stream;

        stream.getTracks().forEach(track => {
          const sender = this.peerConnection.getSenders().find(s => s.track?.kind === track.kind);
          if (sender) sender.replaceTrack(track);
          else this.peerConnection.addTrack(track, stream);
        });

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        this.socket.emit("call-answer", { from: this.userId, to: this.currentCaller, answer });
      } catch (error) {
        console.error("Error answering call:", error);
      }
    },

    setupPeerConnection() {
      this.remoteStream = new MediaStream();
      this.$refs.remoteVideo.srcObject = this.remoteStream;

      this.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => this.remoteStream.addTrack(track));
        this.$refs.remoteVideo.srcObject = event.streams[0];
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit("ice-candidate", { to: this.currentCaller, candidate: event.candidate });
        }
      };
    },

    hangUp() {
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      this.remoteStream = null;
      this.$refs.remoteVideo.srcObject = null;
      if (this.currentCaller) {
        this.socket.emit("call-ended", { from: this.userId, to: this.currentCaller });
      }
      this.currentCaller = null;
    },
  },

  mounted() {
    this.socket = io("http://localhost:3001");
    this.socket.emit("register", this.userId);

    this.socket.on("call-offer", async (data) => {
      if (!data.offer) return;

      this.currentCaller = data.from;
      this.peerConnection = new RTCPeerConnection();
      this.setupPeerConnection();

      try {
        const stream = await this.getMediaDevices();
        this.$refs.localVideo.srcObject = stream;

        stream.getTracks().forEach(track => {
          const sender = this.peerConnection.getSenders().find(s => s.track?.kind === track.kind);
          if (sender) sender.replaceTrack(track);
          else this.peerConnection.addTrack(track, stream);
        });

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        console.log("Remote description set successfully!");

        while (this.iceCandidateQueue.length > 0) {
          const candidate = this.iceCandidateQueue.shift();
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }

        alert(`Incoming call from ${data.from}. Click "Answer Call" to respond.`);
      } catch (err) {
        console.error("Error setting remote description:", err);
      }
    });

    this.socket.on("call-answer", async (data) => {
      if (!data.answer) return;

      try {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {
        console.error("Error setting remote description:", err);
      }
    });

    this.socket.on("ice-candidate", async (data) => {
      if (data.candidate) {
        try {
          if (this.peerConnection.remoteDescription) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          } else {
            this.iceCandidateQueue.push(data.candidate);
          }
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    });

    this.socket.on("call-ended", () => {
      console.log("Call ended by the other party.");
      this.hangUp(); // Ensure both parties disconnect
    });
  },
};
</script>

<style scoped>
#videos {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}
.video-card {
  padding: 10px;
  background: #000;
  border-radius: 10px;
  text-align: center;
}
video {
  width: 100%;
  border-radius: 10px;
}
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
