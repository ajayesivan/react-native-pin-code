/// <reference types="react" />
import { TextStyle, ViewStyle } from "react-native";
export declare namespace PinCodeT {
    interface PinCodeT {
        visible: boolean;
        mode: Modes;
        options?: Options;
        textOptions?: TextOptions;
        styles?: {
            main?: ViewStyle | ViewStyle[];
            enter?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                pinContainer?: ViewStyle | ViewStyle[];
                buttonContainer?: ViewStyle | ViewStyle[];
                buttons?: ViewStyle | ViewStyle[];
                buttonText?: TextStyle | TextStyle[];
                footer?: ViewStyle | ViewStyle[];
                footerText?: TextStyle | TextStyle[];
            };
            locked?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                clockContainer?: ViewStyle | ViewStyle[];
                clockText?: TextStyle | TextStyle[];
                locked?: TextStyle | TextStyle[];
            };
            reset?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                buttons?: TextStyle | TextStyle[];
            };
        };
        onEnterSuccess: (pin?: string) => void;
        onSetSuccess: (pin?: string) => void;
        onSetCancel?: () => void;
        onResetSuccess: () => void;
        onModeChanged?: (lastMode: Modes, newMode?: Modes) => void;
        checkPin?: (pin: string) => Promise<boolean>;
    }
    enum Modes {
        Enter = "enter",
        Set = "set",
        Locked = "locked",
        Reset = "reset"
    }
    enum Statuses {
        Initial = "initial",
        SetOnce = "set.once",
        ResetPrompted = "reset.prompted",
        ResetSucceeded = "reset.succeeded"
    }
    interface Options {
        pinLength?: number;
        disableLock?: boolean;
        lockDuration?: number;
        maxAttempt?: number;
        allowReset?: boolean;
        backSpace?: JSX.Element;
        lockIcon?: JSX.Element;
    }
    interface TextOptions {
        enter?: {
            title?: string;
            subTitle?: string;
            error?: string;
            backSpace?: string;
            footerText?: string;
        };
        set?: {
            title?: string;
            subTitle?: string;
            repeat?: string;
            error?: string;
            cancel?: string;
        };
        locked?: {
            title?: string;
            subTitle?: string;
            lockedText?: string;
        };
        reset?: {
            title?: string;
            subTitle?: string;
            reset?: string;
            resetButton?: string;
            confirm?: string;
            confirmButton?: string;
            backButton?: string;
        };
    }
}
export declare const DEFAULT: {
    Options: {
        pinLength: number;
        allowReset: boolean;
        disableLock: boolean;
        lockDuration: number;
        maxAttempt: number;
    };
    TextOptions: {
        enter: {
            title: string;
            subTitle: string;
            error: string;
            backSpace: string;
            footerText: string;
        };
        set: {
            title: string;
            subTitle: string;
            repeat: string;
            error: string;
            cancel: string;
        };
        locked: {
            title: string;
            subTitle: string;
            lockedText: string;
        };
        reset: {
            title: string;
            subTitle: string;
            resetButton: string;
            confirm: string;
            confirmButton: string;
            backButton: string;
        };
    };
};
export declare const PIN_KEY = "@pincode";
