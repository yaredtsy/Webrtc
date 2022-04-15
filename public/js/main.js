import * as store from "./store.js";
import * as wss from "./wss.js";
import * as webRtcHandler from "./webRtcHandler.js";
import * as constants from "./constants.js";

const socket = io("/");

wss.register(socket);

const personalCodeCopy = document.getElementById("personal_code_copy_button");

personalCodeCopy.addEventListener("click", () => {
  const id = store.getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(id);
});

const personalCodeChatButton = document.getElementById(
  "personal_code_chat_button"
);

const personalCodeVideoButton = document.getElementById(
  "personal_code_video_button"
);

personalCodeChatButton.addEventListener("click", () => {
  const reciverPersonCode = document.getElementById("personal_code_input");

  const calltype = constants.CallType.CHAT_PERSONAL_CODE;

  webRtcHandler.sentPreOffer(calltype, reciverPersonCode.value);
});

personalCodeVideoButton.addEventListener("click", () => {
  const reciverPersonCode = document.getElementById("personal_code_input");

  const calltype = constants.CallType.VIDEO_PERSONAL_CODE;

  webRtcHandler.sentPreOffer(calltype, reciverPersonCode.value);
});

