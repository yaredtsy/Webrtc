import * as constants from "./constants.js";
import * as wss from "./wss.js";
import * as ui from "./ui.js";

let connectedUserDetails = {};
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
    ui.showingCallingDialog(callingDianlogCallHandler)
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
const acceptCallBack = () => {};

const rejectCallType = () => {};

const callingDianlogCallHandler = () =>{
    console.log("it works");
}