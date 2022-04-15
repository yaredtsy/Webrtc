import * as constants from './constants.js';
import * as element from './elements.js';

export const updatePersonalCode =(code)=>{
    const personalcode = document.getElementById('personal_code_paragraph')
    personalcode.innerHTML = code
}

export const showIncomingCallDialog = (calltype,accept,reject)=>{
    const calltypeinfo = calltype==constants.CallType.CHAT_PERSONAL_CODE?"chat":"video"
    const incomingcallDialog = element.getIncomingCallDialog(calltypeinfo,accept,reject)

    const dialog = document.getElementById('dialog')
    dialog.querySelectorAll('*').forEach(dialog=>dialog.remove());

    dialog.appendChild(incomingcallDialog)

}

export const showingCallingDialog = (rejectCallHandler) =>{

    const callingDialog = element.getCallingDialog()

    const dialog = document.getElementById('dialog')
    dialog.querySelectorAll('*').forEach(dialog=>dialog.remove());

    dialog.appendChild(callingDialog)
}