import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRtcHandler from './WebRtcHandler.js';

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
};

export const sendPreOffer = (data) =>{
    socketIO.emit('pre-offer',data);
}

export const sendPreOfferAnswer = (data)=>{
  socketIO.emit('pre-offer-answer',data);
}

