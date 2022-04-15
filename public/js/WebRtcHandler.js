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

const configration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:13902'
    }
  ],
}

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
  peerconnection = new RTCPeerConnection(configration);

  peerconnection.onicecandidate = (event)=>{
    if(event){

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

  if (
    calltype == constants.CallType.CHAT_PERSONAL_CODE ||
    calltype == constants.CallType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(calltype, acceptCallBack, rejectCallType);
  }
};
const acceptCallBack = () => {
  sendPreOfferAnswer(constants.PreOfferAnswer.CALL_ACCEPTED);
  createPeerConnection(connectedUserDetails.calltype)

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
    console.log(data.calltype);
    createPeerConnection(data.calltype)
    ui.showCallElement(data.calltype)
  }
}