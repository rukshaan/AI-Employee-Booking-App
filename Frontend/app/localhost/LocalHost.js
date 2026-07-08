import { Platform } from "react-native";

const apiHost = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === "android" ? "192.168.8.150" : "localhost");

export default { localhost: apiHost };
