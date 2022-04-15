import * as constants from "./constants.js";
import * as wss from "./wss.js";
import * as ui from "./ui.js";

let connectedUserDetails = {};


export const getLocalPreview = ()=>{
  
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
    ui.showCallElement(data.calltype)
  }
}