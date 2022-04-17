import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRtcHandler from './WebRtcHandler.js';
import * as constants from "./constants.js";

let socketIO;

export const register = (socket) => {
  socket.on("connect", () => {

    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id)
    socketIO = socket
  });

  socket.on('pre-offer',(data)=>{
      webRtcHandler.handlePreOffer(data)
  })

  socket.on('pre-offer-answer',(data)=>{
    webRtcHandler.handlePreOfferAnswer(data)
  })

  socket.on('webRTC-signaling',(data)=>{
   
    switch(data.type){
      case constants.webRTCSignaling.OFFER:
        webRtcHandler.handleWebRTCOffer(data)
        break
      case constants.webRTCSignaling.ANSWER:
        webRtcHandler.handleWebRTCAnswer(data)
        break
      case constants.webRTCSignaling.ICE_CANDIDATE:
        webRtcHandler.handleWebRTCCandidate(data)
        break;
      default:
        return;
    }
  })
};

export const getSocketId = ()=> socketIO.id

export const sendPreOffer = (data) =>{
    socketIO.emit('pre-offer',data);
}

export const sendPreOfferAnswer = (data)=>{
  socketIO.emit('pre-offer-answer',data);
}

export const sendDataUsingWebRTCSingling = (data)=>{
  socketIO.emit('webRTC-signaling',data);
}
