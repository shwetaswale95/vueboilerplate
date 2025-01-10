<template>
  <div>
    <h1>Video Call</h1>
    <div id="localVideoContainer">
      <video id="localVideo" autoplay playsinline></video>
    </div>
    <div id="remoteVideoContainer">
      <video id="remoteVideo" autoplay playsinline></video>
    </div>
    <button @click="startCall">Start Call</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      configuration: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      },
    };
  },
  methods: {
    async createPeerConnection() {
      try {
        // Ensure the browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Your browser does not support camera or microphone access.');
          return;
        }

        // Request user media
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        // Attach local stream to video element
        const localVideo = document.getElementById('localVideo');
        if (localVideo) {
          localVideo.srcObject = this.localStream;
        }

        // Create a new RTCPeerConnection
        this.peerConnection = new RTCPeerConnection(this.configuration);

        // Add tracks to peer connection
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection.addTrack(track, this.localStream);
        });

        // Handle remote stream
        this.remoteStream = new MediaStream();
        this.peerConnection.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            this.remoteStream.addTrack(track);
          });
        };

        const remoteVideo = document.getElementById('remoteVideo');
        if (remoteVideo) {
          remoteVideo.srcObject = this.remoteStream;
        }

        console.log('PeerConnection created successfully');
      } catch (error) {
        console.error('Error creating peer connection:', error);
        if (error.name === 'NotAllowedError') {
          alert('Permission to access camera or microphone was denied.');
        } else if (error.name === 'NotFoundError') {
          alert('No camera or microphone found.');
        } else {
          alert('Error accessing media devices: ' + error.message);
        }
      }
    },
    async startCall() {
      if (!this.peerConnection) {
        await this.createPeerConnection();
      }
      // Additional signaling logic goes here
    },
  },
  mounted() {
    this.createPeerConnection();
  },
  beforeUnmount() {
    // Clean up media streams and peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  },
};
</script>

<style>
#localVideoContainer, #remoteVideoContainer {
  margin: 10px;
}
video {
  width: 300px;
  height: 200px;
  border: 1px solid black;
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
