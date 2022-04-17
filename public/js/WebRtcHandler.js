import * as constants from "./constants.js";
import * as wss from "./wss.js";
import * as ui from "./ui.js";
import * as store from "./store.js";

let connectedUserDetails = {};
let peerconnection = {}

const defaultConstraints ={
  audio: true,
  video: true,
}


const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};
export const getLocalPreview = ()=>{
  navigator.mediaDevices.getUserMedia(defaultConstraints)
    .then((stream)=>{
      ui.updateLocalVideo(stream);
      store.setLocalStream(stream);
    })
    .catch((err)=>{
      console.log(err);
    })
}

const createPeerConnection = ()=>{
  peerconnection = new RTCPeerConnection(configuration);
  console.log("<=-createPeerConnection-=>");
  console.log(peerconnection)

  peerconnection.onicecandidateerror = (error)=>{
    console.log("on error ");
    console.log(error);
  }

  peerconnection.onicecandidate = (event)=>{
    console.log("ice candidate founded ");

    if(event){

        wss.sendDataUsingWebRTCSingling({

          socketid: store.getState().remoteSocketID,
          type:constants.webRTCSignaling.ICE_CANDIDATE,
          candidate: event.candidate

        })

    }
  }

  peerconnection.onconnectionstatechange = (event) =>{
    if(peerconnection.connectionState == 'connected'){

    }
  }

  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream)

  peerconnection.ontrack = (event)=>{
    remoteStream.addTrack(event.track)
  }

  if(connectedUserDetails.calltype === constants.CallType.VIDEO_PERSONAL_CODE){
    const localStream = store.getState().localStream
    for(const track of localStream.getTracks()){
      peerconnection.addTrack(track,localStream)
    }
  }
}

export const sentPreOffer = (calltype, code) => {
  connectedUserDetails = {
    calltype,
    socketId: code,
  };

  store.setRemoteSocket(code)

  if (
    calltype == constants.CallType.CHAT_PERSONAL_CODE ||
    calltype == constants.CallType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      calltype,
      code,
    };
    ui.showingCallingDialog(callingDianlogCallHandler);
    wss.sendPreOffer(data);
  }

 
};

export const handlePreOffer = (data) => {
  const { callerId, calltype } = data;

  connectedUserDetails = {
    calltype,
    socketId: callerId,
  };
  store.setRemoteSocket(callerId)
  if (
    calltype == constants.CallType.CHAT_PERSONAL_CODE ||
    calltype == constants.CallType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(calltype, acceptCallBack, rejectCallType);
  }
};
const acceptCallBack = () => {
  sendPreOfferAnswer(constants.PreOfferAnswer.CALL_ACCEPTED);
  createPeerConnection()

  ui.showCallElement(connectedUserDetails.calltype)
};

const rejectCallType = () => {
  sendPreOfferAnswer(constants.PreOfferAnswer.CALL_REJECTED);
};

const callingDianlogCallHandler = () => {
  console.log("it works");

};

const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    callerId: connectedUserDetails.socketId,
    preOfferAnswer,
    calltype: connectedUserDetails.calltype
  };
  ui.removeALlDiallogs()
  wss.sendPreOfferAnswer(data);
};


export const handlePreOfferAnswer = (data) =>{
  const { preOfferAnswer} = data;
  ui.removeALlDiallogs();
  
  if(preOfferAnswer == constants.PreOfferAnswer.CALL_NOT_FOUND){
    ui.showInfoDialog(preOfferAnswer)
  }

  if(preOfferAnswer == constants.PreOfferAnswer.CALL_UNAVAILABLE){
    ui.showInfoDialog(preOfferAnswer)
  }
  if(preOfferAnswer == constants.PreOfferAnswer.CALL_REJECTED){
    ui.showInfoDialog(preOfferAnswer)
  }
  if(preOfferAnswer == constants.PreOfferAnswer.CALL_ACCEPTED){
    
    createPeerConnection()
    ui.showCallElement(data.calltype)
    sendWebRTcOffer()
    console.log(connectedUserDetails);
  }
}

const sendWebRTcOffer = async() =>{
  console.log(" sendWebRTcOffer ");

  const offer = await peerconnection.createOffer();
  await peerconnection.setLocalDescription(offer);

  wss.sendDataUsingWebRTCSingling({
    socketid: store.getState().remoteSocketID,
    type: constants.webRTCSignaling.OFFER,
    offer: offer
  })

}

export const handleWebRTCOffer = async(data)=>{
 
  await peerconnection.setRemoteDescription(data.offer)
  const answer = await peerconnection.createAnswer();
  console.log(answer);
  await peerconnection.setLocalDescription(answer)

  wss.sendDataUsingWebRTCSingling({
    socketid: store.getState().remoteSocketID,
    type:constants.webRTCSignaling.ANSWER,
    answer: answer
  })

}

export const handleWebRTCAnswer = async(data)=>{

  await peerconnection.setRemoteDescription(data.answer)
}

export const handleWebRTCCandidate= async(data)=>{
  try {
    await peerconnection.addIceCandidate(data.candidate)
  } catch (error) {
    console.error(
      "error occurred while trying to add received ice candidate",
      err
    )
  }
}
