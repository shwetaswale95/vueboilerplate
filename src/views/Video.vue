<template>
  <div class="video-call" style="margin-top: 100px; text-align: center;">
    <h1>Video Call</h1>
    <div id="videos">
      <v-card class="video-card">
        <video ref="localVideo" autoplay muted></video>
      </v-card>
      <v-card class="video-card">
        <video ref="remoteVideo" autoplay></video>
      </v-card>
    </div>
    <div class="button-group">
      <v-btn rounded color="primary" @click="startCall">
        <v-icon left>mdi-phone</v-icon>
        Start Call
      </v-btn>
      <v-btn rounded color="success" @click="answerCall">
        <v-icon left>mdi-phone-incoming</v-icon>
        Answer Call
      </v-btn>
      <v-btn rounded color="error" @click="hangUp">
        <v-icon left>mdi-phone-hangup</v-icon>
        Hang Up
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
      peerConnection: null,
      remoteStream: null,
      userId: Math.random().toString(36).substring(7),
      isCallActive: false,
      isReceivingCall: false,
    };
  },
  methods: {
    async startCall() {
      this.peerConnection = new RTCPeerConnection();
      this.peerConnection.onicecandidate = this.handleICECandidate;
      this.peerConnection.ontrack = this.handleTrackEvent;

      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.$refs.localVideo.srcObject = this.localStream;
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.socket.emit("call-offer", { from: this.userId, to: "user2", offer });
    },
    async answerCall() {
      this.peerConnection = new RTCPeerConnection();
      this.peerConnection.onicecandidate = this.handleICECandidate;
      this.peerConnection.ontrack = this.handleTrackEvent;

      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.$refs.localVideo.srcObject = this.localStream;
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit("call-answer", { from: this.userId, to: "user2", answer });
    },
    handleTrackEvent(event) {
      this.remoteStream = event.streams[0];
      this.$refs.remoteVideo.srcObject = this.remoteStream;
    },
    handleICECandidate(event) {
      if (event.candidate) {
        this.socket.emit("ice-candidate", { to: "user2", candidate: event.candidate });
      }
    },
    hangUp() {
      this.peerConnection.close();
      this.peerConnection = null;
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
      this.isCallActive = false;
      this.isReceivingCall = false;
    },
  },
  mounted() {
    this.socket = io("http://localhost:3001");
    this.socket.emit("register", this.userId);

    this.socket.on("call-offer", async (data) => {
      if (!this.isCallActive) {
        this.isReceivingCall = true;
        const offer = data.offer;
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.onicecandidate = this.handleICECandidate;
        this.peerConnection.ontrack = this.handleTrackEvent;

        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.$refs.localVideo.srcObject = this.localStream;
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection.addTrack(track, this.localStream);
        });
        await this.peerConnection.setRemoteDescription(offer);
      }
    });
    
    this.socket.on("call-answer", async (data) => {
      const answer = data.answer;
      await this.peerConnection.setRemoteDescription(answer);
      this.isReceivingCall = false;
      this.isCallActive = true;
    });
    
    this.socket.on("ice-candidate", (data) => {
      const candidate = new RTCIceCandidate(data.candidate);
      this.peerConnection.addIceCandidate(candidate);
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
