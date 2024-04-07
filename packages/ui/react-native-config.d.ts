declare module "react-native-config" {
  export interface NativeConfig {
    ENV: "test" | "stage" | "prod";
    APP_NAME: string;
    APP_IOS_VERSION_CODE: string;
    APP_ANDROID_VERSION_CODE: string;
    APP_IOS_VERSION: string;
    APP_ANDROID_VERSION: string;
    API_BASE_URL: string;
    APP_WEBVIEW_URL: string;
    APP_SENTRY_URL: string;
    ZT_API_BASE_URL: string;
    APP_TD_AMAP_ANDROID_KEY: string;
    APP_TD_AMAP_IOS_KEY: string;
  }
  export const Config: NativeConfig;
  export default Config;
}

declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.svg" {
  import type React from "react";
  import type { SvgProps } from "react-native-svg";
  const content: FC<SvgProps>;
  export default content;
}
