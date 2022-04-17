let state = {
    socketId: null,
    remoteSocketID:null,
    localStream: null,
    remoteStream: null,
    screenSharingStream: null,
    allowConnectionFromStrangers: false,
    screenSharingActive: false,
}

export const setSocketId = (socketId) =>{
    state = {
        ...state,
        socketId: socketId
    }
    console.log(state);
}

export const setRemoteSocket = (remoteSocket) =>{
    state = {
        ...state,
        remoteSocketID: remoteSocket
    }
}

export const setLocalStream = (localStream) =>{
    state = {
        ...state,
        localStream: localStream,

    }
}

export const setRemoteStream = (remoteStream) =>{
    state={
        ...state,
        remoteStream: remoteStream
    }
}

export const setAllowConnectionFromStrangers = (allowConnectionFromStrangers) =>{
    state={
        ...state,
        allowConnectionFromStrangers: allowConnectionFromStrangers
    }
}

export const setScreenSharingStream = (screenSharingStream) =>{
    state={
        ...state,
        screenSharingStream: screenSharingStream
    }
}

export const setscreenSharingActive = (screenSharingActive)=>{
    state={
        ...state,
        screenSharingActive: screenSharingActive
    }
}

export const getState = ()=>{
    return state
}
