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
};

export const sendPreOffer = (data) =>{
    socketIO.emit('pre-offer',data);
}

