import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDwsK_VF51snTfKNDlDL9q04m9v9lHRYUs",
  authDomain: "trading-e4712.firebaseapp.com",
  projectId: "trading-e4712",
  storageBucket: "trading-e4712.firebasestorage.app",
  messagingSenderId: "607474598446",
  appId: "1:607474598446:web:badc03c93b70780325d5bf",
  measurementId: "G-3FGW1R7KV5"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const listenForegroundNotification = (navigate) => {
  const messaging = getMessaging();

  onMessage(messaging, (payload) => {
    const data = payload.data;
  //   if (data?.type === "chat") {
  //     navigate(`/chat/${data.conversationId}`);
  //   }

  //   if (data?.type === "chat") {
  //     navigate(`/chat/${data.fromUserId}`);
  //   }
  });
};