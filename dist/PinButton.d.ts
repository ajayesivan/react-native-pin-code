/// <reference types="react" />
import { TextStyle, ViewStyle } from 'react-native';
declare const PinButton: ({ value, style, textStyle, disabled, backSpace, backSpaceText, onPress }: {
    value: string;
    disabled?: boolean | undefined;
    backSpace?: JSX.Element | undefined;
    backSpaceText?: string | undefined;
    onPress: (number: string) => void;
    style?: ViewStyle | (ViewStyle | undefined)[] | undefined;
    textStyle?: TextStyle | TextStyle[] | undefined;
}) => JSX.Element;
export default PinButton;
