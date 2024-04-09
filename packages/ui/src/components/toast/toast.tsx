import RootSiblings from "react-native-root-siblings";
import { Image, Text, View } from "react-native";
import classNames from "classnames";
import type { ReactNode } from "react";
import { useToastStore } from "./store";
import errorPng from "@assets/images/error.png";
import successPng from "@assets/images/success.png";
import { CallbackResult, errorHandler, successHandler } from "./util";
import LoadingView from "./Loading";

type ToastOptions = {
  /** 提示的内容 */
  title: string;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: () => void;
  /** 提示的延迟时间 */
  duration?: number;
  /** 接口调用失败的回调函数 */
  fail?: () => void;
  /** 图标
   *
   * 可选值：
   * - 'success': 显示成功图标，此时 title 文本最多显示 7 个汉字长度;
   * - 'error': 显示失败图标，此时 title 文本最多显示 7 个汉字长度;
   * - 'loading': 显示加载图标，此时 title 文本最多显示 7 个汉字长度;
   * - 'none': 不显示图标，此时 title 文本最多可显示两行 */
  icon?: "success" | "error" | "loading" | "none";
  /** 当 icon 为 none 时可用，位置  */
  position?: "top" | "bottom" | "center";
  /** 自定义图标的本地路径，image 的优先级高于 icon */
  image?: string;
  /** 是否显示透明蒙层，防止触摸穿透 */
  mask?: boolean;
  /** 接口调用成功的回调函数 */
  success?: () => void;
};

type LoadingOptions = {
  /** 提示的内容 */
  title?: string;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: () => void;
  /** 接口调用失败的回调函数 */
  fail?: () => void;
  /** 是否显示透明蒙层，防止触摸穿透 */
  mask?: boolean;
  /** 接口调用成功的回调函数 */
  success?: () => void;
  /** 时间 */
  durations?: number;
};

type HideToastOptions = {
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: CallbackResult) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: CallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: CallbackResult) => void;
};

type HideLoadingOptions = {
  /** 目前 toast 和 loading 相关接口可以相互混用，此参数可用于取消混用特性
   * @default false
   */
  noConflict?: boolean;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: CallbackResult) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: CallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: CallbackResult) => void;
};
const TstLoading = ({ title, mask }: { title: string; mask: boolean }) => {
  return (
    <View
      className={classNames("z-[10000]", {
        "absolute w-full h-full items-center justify-center": !mask || mask,
        "bg-black/60": mask,
      })}
    >
      <View className="relative max-h-[200px] min-h-[120px] min-w-[120px] max-w-[200px] flex-col items-center justify-center rounded-lg bg-black/80">
        <View className="flex-1 items-center justify-center">
          <LoadingView />
        </View>
        <View className="relative bottom-[15%] min-w-[120px] max-w-[200px] items-center justify-center p-3">
          <Text className="text-[15px] text-white">{title}</Text>
        </View>
      </View>
    </View>
  );
};

function showToast(options: ToastOptions): Promise<{ errMsg: string }> {
  let {
    title,
    icon = "success",
    image,
    duration = 1500,
    position = "center",
    mask = false,
    success,
    fail,
    complete,
  } = options || {};

  const isLoading = icon === "loading";

  const res = isLoading
    ? { errMsg: "showLoading:ok" }
    : { errMsg: "showToast:ok" };

  let ToastView: ReactNode | null = null;

  if (image) {
    ToastView = (
      <View
        className={classNames("z-[10000]", {
          "absolute w-full h-full items-center justify-center": !mask || mask,
          "bg-black/60": mask,
        })}
      >
        <View className="re max-h-[200px] min-h-[120px] min-w-[120px] max-w-[200px] flex-col items-center justify-center rounded-lg bg-black/80">
          <Image className="size-[55]" src={image} />
          <Text className="absolute bottom-[15%] pt-[10] text-[15px] text-white">
            {title}
          </Text>
        </View>
      </View>
    );
  } else if (isLoading) {
    ToastView = <TstLoading title={title} mask={mask} />;
  } else if (icon === "none") {
    ToastView = (
      <View
        className={classNames("z-[10000]", {
          "absolute w-full h-full": !mask || mask,
          "bg-black/60": mask,
          "items-center justify-center":
            position === "center" && icon === "none",
          "items-center justify-start top-24":
            position === "top" && icon === "none",
          "items-center justify-end bottom-20":
            position === "bottom" && icon === "none",
        })}
      >
        <View className="w-[180] flex-col items-center justify-center rounded-lg bg-black/80">
          <Text className="px-[15] py-[10] text-center text-white">
            {title || ""}
          </Text>
        </View>
      </View>
    );
  } else {
    ToastView = (
      <View
        className={classNames("z-[10000]", {
          "absolute w-full h-full items-center justify-center ": !mask || mask,
          "bg-black/60": mask,
        })}
      >
        <View className="max-h-[200px] min-h-[120px] min-w-[120px] max-w-[200px] flex-col items-center justify-center rounded-lg bg-black/80">
          <View className="size-[76] items-center justify-center">
            <Image
              className="size-[55]"
              source={icon === "error" ? errorPng : successPng}
            />
            <Text className="mt-2 text-center text-white">{title || ""}</Text>
          </View>
        </View>
      </View>
    );
  }

  try {
    // setTimeout fires incorrectly when using chrome debug #4470
    // https://github.com/facebook/react-native/issues/4470
    useToastStore.getState().rootSiblings?.destroy();

    useToastStore.getState().rootSiblings = new RootSiblings(ToastView);

    setTimeout(() => {
      useToastStore.getState().rootSiblings?.update(ToastView);
    }, 100);

    if (duration > 0) {
      setTimeout(() => {
        useToastStore.getState().rootSiblings?.destroy();
      }, duration);
    }

    return successHandler(success, complete)(res);
  } catch (e: any) {
    res.errMsg = isLoading
      ? `showLoading:fail invalid ${e}`
      : `showToast:fail invalid ${e}`;
    console.log("error", { ...e });
    return errorHandler(fail, complete)(res);
  }
}

function showLoading(options: LoadingOptions) {
  const {
    title = "",
    durations = 1500,
    mask,
    success,
    fail,
    complete,
  } = options;

  return showToast({
    title,
    icon: "loading",
    duration: durations,
    mask,
    success,
    fail,
    complete,
    position: "center",
  });
}

function hideToast(opts: HideToastOptions = {}): void {
  const { success, fail, complete } = opts;

  try {
    useToastStore.getState().rootSiblings?.destroy();
    useToastStore.setState({
      rootSiblings: null,
    });
    const res = { errMsg: "showToast:ok" };
    success?.(res);
    complete?.(res);
  } catch (e: any) {
    const res = { errMsg: e };
    fail?.(res);
    complete?.(res);
  }
}

function hideLoading(opts: HideLoadingOptions = {}) {
  const { success, fail, complete } = opts;

  try {
    useToastStore.getState().rootSiblings?.destroy();
    useToastStore.setState({
      rootSiblings: null,
    });

    const res = { errMsg: "showLoading:ok" };
    success?.(res);
    complete?.(res);
  } catch (e: any) {
    const res = { errMsg: e };
    fail?.(res);
    complete?.(res);
  }
}

export const Toast = {
  hideLoading,
  hideToast,
  showLoading,
  showToast,
} as const;
