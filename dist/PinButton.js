import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DEFAULT } from './types';
const PinButton = ({ value, style, textStyle, disabled = false, backSpace, backSpaceText, onPress }) => {
    if (value == 'delete') {
        return <TouchableOpacity disabled={disabled} style={[styles.container, { backgroundColor: 'transparent' }, style]} onPress={() => onPress(value)}>
            {backSpace ? backSpace : <Text style={[styles.number, { color: 'white' }, textStyle]}>{backSpaceText || DEFAULT.TextOptions.enter.backSpace}</Text>}
        </TouchableOpacity>;
    }
    else {
        return <TouchableOpacity disabled={disabled} style={[styles.container, { backgroundColor: disabled ? 'rgba(255,255,255,0.8)' : '#FFF' }, style]} onPress={() => onPress(value)}>
            <Text style={[styles.number, textStyle]}>{value}</Text>
        </TouchableOpacity>;
    }
};
const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
    number: { fontSize: 20 }
});
export default PinButton;
//# sourceMappingURL=PinButton.js.map