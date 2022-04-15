import * as constants from "./constants.js";
import * as element from "./elements.js";

export const updatePersonalCode = (code) => {
  const personalcode = document.getElementById("personal_code_paragraph");
  personalcode.innerHTML = code;
};

export const showIncomingCallDialog = (calltype, accept, reject) => {
  const calltypeinfo =
    calltype == constants.CallType.CHAT_PERSONAL_CODE ? "chat" : "video";
  const incomingcallDialog = element.getIncomingCallDialog(
    calltypeinfo,
    accept,
    reject
  );

  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());

  dialog.appendChild(incomingcallDialog);
};

export const showingCallingDialog = (rejectCallHandler) => {
  const callingDialog = element.getCallingDialog();

  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());

  dialog.appendChild(callingDialog);
};

export const removeALlDiallogs = () => {
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
};

export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog = null;
  if (preOfferAnswer == constants.PreOfferAnswer.CALL_REJECTED) {
    infoDialog = element.getInfoDialog(
      "Call rejected",
      "Calle rejected your call"
    );
  }
  if (preOfferAnswer == constants.PreOfferAnswer.CALL_NOT_FOUND) {
    infoDialog = element.getInfoDialog(
      "Call not found",
      "Please check personal code"
    );
  }

  if (preOfferAnswer == constants.PreOfferAnswer.CALL_UNAVAILABLE) {
    infoDialog = element.getInfoDialog(
      "Call is not possible",
      "the line is buzy.please try again"
    );
  }

  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.appendChild(infoDialog);

    setTimeout(() => {
      removeALlDiallogs();
    }, [4000]);
  }
};

export const showCallElement = (calltype) =>{
    console.log(calltype);
    if(calltype === constants.CallType.CHAT_PERSONAL_CODE){
        showChatCallElement()
    }    
    if(calltype === constants.CallType.VIDEO_PERSONAL_CODE){
        showVideoCallElement()
    }
}

const showChatCallElement = () =>{
    const finishConnectionChatButtonContainer = document.getElementById(
        "finish_chat_button_container"
    )
    showElement(finishConnectionChatButtonContainer)

    const newMessageInput = document.getElementById("new_message")
    showElement(newMessageInput);
    disableDashboard()
}

const showVideoCallElement = () =>{
   const callButtons = document.getElementById('call_buttons')
   showElement(callButtons)

    const remoteVideo = document.getElementById("remote_video")
    showElement(remoteVideo);
    disableDashboard()
}

const enbleDhashboard = () =>{
    const dashboardBlocker = document.getElementById('dashboard_blur')

    if(dashboardBlocker.classList.contains('display_none')) {
        dashboardBlocker.classList.add('display_none')
    }
}

const disableDashboard = () =>{
    const dashboardBlocker = document.getElementById('dashboard_blur')

    if(dashboardBlocker.classList.contains('display_none')) {
        dashboardBlocker.classList.remove('display_none')
    }
}

const hideELemnt = (element)=>{
    if(!element.classList.contains('display_none')){
        element.classList.add('display_none')
    }
}

const showElement = (element) =>{
    if(element.classList.contains('display_none')){
        element.classList.remove('display_none')
    }
}