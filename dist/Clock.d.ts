/// <reference types="react" />
import { ViewStyle, TextStyle } from 'react-native';
declare const Clock: ({ duration, style, textStyle, onFinish }: {
    duration?: number | undefined;
    style?: ViewStyle | ViewStyle[] | undefined;
    textStyle?: TextStyle | TextStyle[] | undefined;
    onFinish: () => void;
}) => JSX.Element;
export declare function millisToMinutesAndSeconds(milliseconds: number): string;
export default Clock;
