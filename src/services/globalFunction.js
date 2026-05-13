import { getToken } from "firebase/messaging";
import { getApiData, securePostData } from "./api";
import { messaging } from "../firebase";

async function getWebisteSetting() {
    const result=await getApiData('get-website-setting')
    if(result.success){
        return result.setting
    }
    return;

}
const saveFcmToken = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") return;
            const token = await getToken(messaging, {
                vapidKey: "BIDIO3oWjjaWf98w2C4o8mlbmPLXstXByN5U6BmdoZFNrZ-OyfRx5bZcBxGd9ZW7sBb3cb6dRcP3UHBlU-MY2XA"
            });

            if (token) {
                await securePostData("save-fcm-token", { fcmToken: token });
                console.log("✅ FCM Token Saved");
            }
        } catch (err) {
            console.error("FCM error", err);
        }
    };

export {getWebisteSetting,saveFcmToken}