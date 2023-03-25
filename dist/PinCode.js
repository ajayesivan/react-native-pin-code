var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Vibration, Text, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { PinCodeT, DEFAULT, PIN_KEY } from './types';
import PinButton from './PinButton';
import Clock, { millisToMinutesAndSeconds } from './Clock';
const PinCode = ({ visible = false, mode = PinCodeT.Modes.Enter, options, textOptions, styles, onEnterSuccess, onSetSuccess, onSetCancel, onResetSuccess, onModeChanged, checkPin, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30;
    const [pin, setPin] = useState('');
    const [lastPin, setLastPin] = useState('');
    const [curMode, setCurMode] = useState(mode);
    const [status, setStatus] = useState(PinCodeT.Statuses.Initial);
    const [failureCount, setFailureCount] = useState(0);
    const [showError, setShowError] = useState(false);
    const [curOptions, setCurOptions] = useState(DEFAULT.Options);
    const [curTextOptions, setCurTextOptions] = useState(DEFAULT.TextOptions);
    const [buttonsDisabled, disableButtons] = useState(false);
    useEffect(() => {
        setCurMode(mode);
        initialize();
    }, [mode]);
    useEffect(() => {
        setCurOptions(Object.assign(Object.assign({}, DEFAULT.Options), options));
    }, [options]);
    useEffect(() => {
        if (!textOptions)
            return;
        // there are only 2 levels, don't use deepmerge library for least dependencies
        const merged = {
            enter: Object.assign(Object.assign({}, DEFAULT.TextOptions.enter), textOptions.enter),
            set: Object.assign(Object.assign({}, DEFAULT.TextOptions.set), textOptions.set),
            locked: Object.assign(Object.assign({}, DEFAULT.TextOptions.locked), textOptions.locked),
            reset: Object.assign(Object.assign({}, DEFAULT.TextOptions.reset), textOptions.reset)
        };
        setCurTextOptions(merged);
    }, [textOptions]);
    function initialize() {
        setPin('');
        setLastPin('');
        setShowError(false);
        disableButtons(false);
        setStatus(PinCodeT.Statuses.Initial);
    }
    function switchMode(newMode) {
        setCurMode(newMode);
        initialize();
        if (onModeChanged)
            onModeChanged(curMode, newMode);
    }
    function onPinButtonPressed(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let newPin = '';
            if (value == 'delete') {
                newPin = pin.substr(0, pin.length - 1);
            }
            else {
                newPin = pin + value;
            }
            setPin(newPin);
            if (newPin.length == curOptions.pinLength) {
                if (curMode == PinCodeT.Modes.Enter) {
                    yield processEnterPin(newPin);
                }
                else if (curMode == PinCodeT.Modes.Set) {
                    yield processSetPin(newPin);
                }
            }
        });
    }
    function processEnterPin(newPin) {
        return __awaiter(this, void 0, void 0, function* () {
            disableButtons(true);
            const ret = yield checkThePin(newPin);
            setPin('');
            if (ret) {
                setFailureCount(0);
                onEnterSuccess(newPin);
                setStatus(PinCodeT.Statuses.Initial);
                disableButtons(false);
            }
            else {
                if (!curOptions.disableLock && failureCount >= (curOptions.maxAttempt || DEFAULT.Options.maxAttempt) - 1) {
                    switchMode(PinCodeT.Modes.Locked);
                    disableButtons(false);
                }
                else {
                    setFailureCount(failureCount + 1);
                    setStatus(PinCodeT.Statuses.Initial);
                    if (Platform.OS === 'ios') {
                        Vibration.vibrate(); // android requires VIBRATE permission
                    }
                    setShowError(true);
                    setTimeout(() => setShowError(false), 3000);
                    disableButtons(true);
                    setTimeout(() => disableButtons(false), 1000);
                }
            }
        });
    }
    function processSetPin(newPin) {
        return __awaiter(this, void 0, void 0, function* () {
            // STEP 1
            if (status == PinCodeT.Statuses.Initial) {
                setLastPin(newPin);
                setStatus(PinCodeT.Statuses.SetOnce);
                setPin('');
            }
            // STEP 2
            else if (status == PinCodeT.Statuses.SetOnce) {
                if (lastPin == newPin) { // pin matched
                    savePin(newPin);
                    onSetSuccess(newPin);
                }
                else { // pin doesn't matched
                    setShowError(true);
                    if (Platform.OS === 'ios') {
                        Vibration.vibrate(); // android requires VIBRATE permission
                    }
                    setTimeout(() => setShowError(false), 3000);
                    setTimeout(() => setPin(''), 1500);
                }
                setStatus(PinCodeT.Statuses.Initial);
                setLastPin('');
            }
        });
    }
    function onDeletePIN() {
        return __awaiter(this, void 0, void 0, function* () {
            yield AsyncStorage.removeItem(PIN_KEY);
            onResetSuccess();
            switchMode(PinCodeT.Modes.Enter);
        });
    }
    function checkThePin(newPin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (checkPin) {
                return yield checkPin(newPin);
            }
            else {
                const savedPin = yield AsyncStorage.getItem(PIN_KEY);
                return (newPin == savedPin);
            }
        });
    }
    function savePin(newPin) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AsyncStorage.setItem(PIN_KEY, newPin);
            return;
        });
    }
    if (!visible) {
        return <></>;
    }
    if (curMode == PinCodeT.Modes.Enter || curMode == PinCodeT.Modes.Set) {
        const buttonStyle = StyleSheet.flatten([defaultStyles.button, (_a = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _a === void 0 ? void 0 : _a.buttons]);
        return <View style={[defaultStyles.mainContainer, styles === null || styles === void 0 ? void 0 : styles.main]}>
            <View style={[defaultStyles.titleContainer, (_b = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _b === void 0 ? void 0 : _b.titleContainer]}>
                <Text style={[defaultStyles.title, (_c = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _c === void 0 ? void 0 : _c.title]}>{curMode == PinCodeT.Modes.Enter ? (_d = curTextOptions.enter) === null || _d === void 0 ? void 0 : _d.title : (_e = curTextOptions.set) === null || _e === void 0 ? void 0 : _e.title}</Text>
                {curMode == PinCodeT.Modes.Enter ?
            <>
                        <Text style={[defaultStyles.subTitle, (_f = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _f === void 0 ? void 0 : _f.subTitle]}>
                            {(_h = (_g = curTextOptions.enter) === null || _g === void 0 ? void 0 : _g.subTitle) === null || _h === void 0 ? void 0 : _h.replace('{{pinLength}}', (curOptions.pinLength || DEFAULT.Options.pinLength).toString())}
                        </Text>
                        {showError && <Text style={defaultStyles.error}>{(_j = curTextOptions.enter) === null || _j === void 0 ? void 0 : _j.error}</Text>}
                    </> : <>
                        {status == PinCodeT.Statuses.Initial && <Text style={[defaultStyles.subTitle, (_k = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _k === void 0 ? void 0 : _k.subTitle]}>
                            {(_m = (_l = curTextOptions.set) === null || _l === void 0 ? void 0 : _l.subTitle) === null || _m === void 0 ? void 0 : _m.replace('{{pinLength}}', (curOptions.pinLength || DEFAULT.Options.pinLength).toString())}</Text>}
                        {status == PinCodeT.Statuses.SetOnce && <Text style={[defaultStyles.subTitle, (_o = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _o === void 0 ? void 0 : _o.subTitle]}>{(_p = curTextOptions.set) === null || _p === void 0 ? void 0 : _p.repeat}</Text>}
                        {showError && <Text style={defaultStyles.error}>{(_q = curTextOptions.set) === null || _q === void 0 ? void 0 : _q.error}</Text>}
                    </>}
            </View>
            <Pin pin={pin} pinLength={curOptions.pinLength || DEFAULT.Options.pinLength} style={(_r = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _r === void 0 ? void 0 : _r.pinContainer}/>
            <View style={[defaultStyles.buttonContainer, (_s = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _s === void 0 ? void 0 : _s.buttonContainer]}>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'1'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_t = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _t === void 0 ? void 0 : _t.buttonText} onPress={onPinButtonPressed}/>
                    <PinButton value={'2'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_u = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _u === void 0 ? void 0 : _u.buttonText} onPress={onPinButtonPressed}/>
                    <PinButton value={'3'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_v = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _v === void 0 ? void 0 : _v.buttonText} onPress={onPinButtonPressed}/>
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'4'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_w = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _w === void 0 ? void 0 : _w.buttonText} onPress={onPinButtonPressed}/>
                    <PinButton value={'5'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_x = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _x === void 0 ? void 0 : _x.buttonText} onPress={onPinButtonPressed}/>
                    <PinButton value={'6'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_y = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _y === void 0 ? void 0 : _y.buttonText} onPress={onPinButtonPressed}/>
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'7'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_z = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _z === void 0 ? void 0 : _z.buttonText} onPress={onPinButtonPressed}/>
                    <PinButton value={'8'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_0 = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _0 === void 0 ? void 0 : _0.buttonText} onPress={onPinButtonPressed}/>
                    <PinButton value={'9'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_1 = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _1 === void 0 ? void 0 : _1.buttonText} onPress={onPinButtonPressed}/>
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <View style={[defaultStyles.button, { width: 60, height: 60 }]}></View>
                    <PinButton value={'0'} disabled={buttonsDisabled} style={buttonStyle} textStyle={(_2 = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _2 === void 0 ? void 0 : _2.buttonText} onPress={onPinButtonPressed}/>
                    <PinButton value={'delete'} disabled={buttonsDisabled} backSpace={options === null || options === void 0 ? void 0 : options.backSpace} backSpaceText={(_3 = curTextOptions === null || curTextOptions === void 0 ? void 0 : curTextOptions.enter) === null || _3 === void 0 ? void 0 : _3.backSpace} style={defaultStyles.button} textStyle={(_4 = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _4 === void 0 ? void 0 : _4.buttonText} onPress={onPinButtonPressed}/>
                </View>
            </View>
            <View style={[defaultStyles.footer, (_5 = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _5 === void 0 ? void 0 : _5.footer]}>
                {curMode == PinCodeT.Modes.Enter && curOptions.allowReset &&
            <TouchableOpacity onPress={() => {
                switchMode(PinCodeT.Modes.Reset);
            }}>
                        <Text style={[{ padding: 40, color: 'white' }, (_6 = styles === null || styles === void 0 ? void 0 : styles.enter) === null || _6 === void 0 ? void 0 : _6.footerText]}>{(_7 = curTextOptions.enter) === null || _7 === void 0 ? void 0 : _7.footerText}</Text>
                    </TouchableOpacity>}
                {curMode == PinCodeT.Modes.Set &&
            <TouchableOpacity onPress={() => {
                initialize();
                if (onSetCancel)
                    onSetCancel();
            }}>
                        <Text style={{ color: 'white' }}>{(_8 = curTextOptions.set) === null || _8 === void 0 ? void 0 : _8.cancel}</Text>
                    </TouchableOpacity>}
            </View>
        </View>;
    }
    else if (curMode == PinCodeT.Modes.Locked) {
        return <View style={[defaultStyles.mainContainer, styles === null || styles === void 0 ? void 0 : styles.main]}>
            <View style={[defaultStyles.titleContainer, (_9 = styles === null || styles === void 0 ? void 0 : styles.locked) === null || _9 === void 0 ? void 0 : _9.titleContainer]}>
                <Text style={[defaultStyles.title, (_10 = styles === null || styles === void 0 ? void 0 : styles.locked) === null || _10 === void 0 ? void 0 : _10.title]}>{(_11 = curTextOptions.locked) === null || _11 === void 0 ? void 0 : _11.title}</Text>
                <Text style={[defaultStyles.subTitle, (_12 = styles === null || styles === void 0 ? void 0 : styles.locked) === null || _12 === void 0 ? void 0 : _12.subTitle]}>
                    {(_14 = (_13 = curTextOptions.locked) === null || _13 === void 0 ? void 0 : _13.subTitle) === null || _14 === void 0 ? void 0 : _14.replace('{{maxAttempt}}', (curOptions.maxAttempt || DEFAULT.Options.maxAttempt).toString()).replace('{{lockDuration}}', millisToMinutesAndSeconds(curOptions.lockDuration || DEFAULT.Options.lockDuration))}
                </Text>
            </View>
            <View style={defaultStyles.pinContainer}>
                {(options === null || options === void 0 ? void 0 : options.lockIcon) ? options.lockIcon : <Text style={(_15 = styles === null || styles === void 0 ? void 0 : styles.locked) === null || _15 === void 0 ? void 0 : _15.locked}>{(_16 = curTextOptions.locked) === null || _16 === void 0 ? void 0 : _16.lockedText}</Text>}
            </View>
            <View style={defaultStyles.buttonContainer}>
                <Clock style={(_17 = styles === null || styles === void 0 ? void 0 : styles.locked) === null || _17 === void 0 ? void 0 : _17.clockContainer} textStyle={(_18 = styles === null || styles === void 0 ? void 0 : styles.locked) === null || _18 === void 0 ? void 0 : _18.clockText} duration={curOptions.lockDuration} onFinish={() => {
            switchMode(PinCodeT.Modes.Enter);
            setFailureCount(0);
        }}/>
            </View>
        </View>;
    }
    else if (curMode == PinCodeT.Modes.Reset) {
        return <View style={[defaultStyles.mainContainer, styles === null || styles === void 0 ? void 0 : styles.main]}>
            <View style={[defaultStyles.titleContainer, (_19 = styles === null || styles === void 0 ? void 0 : styles.reset) === null || _19 === void 0 ? void 0 : _19.titleContainer]}>
                <Text style={[defaultStyles.title, (_20 = styles === null || styles === void 0 ? void 0 : styles.reset) === null || _20 === void 0 ? void 0 : _20.title]}>{(_21 = curTextOptions.reset) === null || _21 === void 0 ? void 0 : _21.title}</Text>
                <Text style={[defaultStyles.subTitle, (_22 = styles === null || styles === void 0 ? void 0 : styles.reset) === null || _22 === void 0 ? void 0 : _22.subTitle]}>{(_23 = curTextOptions.reset) === null || _23 === void 0 ? void 0 : _23.subTitle}</Text>
            </View>
            <View style={defaultStyles.buttonContainer}>
                {status == PinCodeT.Statuses.Initial && <>
                    <TouchableOpacity onPress={() => setStatus(PinCodeT.Statuses.ResetPrompted)}>
                        <Text style={[defaultStyles.confirm, (_24 = styles === null || styles === void 0 ? void 0 : styles.reset) === null || _24 === void 0 ? void 0 : _24.buttons]}>{(_25 = curTextOptions.reset) === null || _25 === void 0 ? void 0 : _25.resetButton}</Text>
                    </TouchableOpacity>
                </>}
                {status == PinCodeT.Statuses.ResetPrompted && <>
                    <Text style={{ color: 'white', marginBottom: 20 }}>{(_26 = curTextOptions.reset) === null || _26 === void 0 ? void 0 : _26.confirm}</Text>
                    <TouchableOpacity onPress={onDeletePIN}>
                        <Text style={[defaultStyles.confirm, (_27 = styles === null || styles === void 0 ? void 0 : styles.reset) === null || _27 === void 0 ? void 0 : _27.buttons]}>{(_28 = curTextOptions.reset) === null || _28 === void 0 ? void 0 : _28.confirmButton}</Text>
                    </TouchableOpacity>
                </>}
                <TouchableOpacity onPress={() => switchMode(PinCodeT.Modes.Enter)}>
                    <Text style={[{ fontSize: 14, paddingHorizontal: 40, paddingVertical: 20, color: 'white' }, (_29 = styles === null || styles === void 0 ? void 0 : styles.reset) === null || _29 === void 0 ? void 0 : _29.buttons]}>{(_30 = curTextOptions.reset) === null || _30 === void 0 ? void 0 : _30.backButton}</Text>
                </TouchableOpacity>
            </View>
        </View>;
    }
    return <></>;
};
const Pin = ({ pin, pinLength, style }) => {
    const items = [];
    for (let i = 1; i <= pinLength; i++) {
        items.push(<Text key={'pin_' + i} style={{
            width: pin.length >= i ? 12 : 6,
            height: pin.length >= i ? 12 : 6,
            borderRadius: pin.length >= i ? 6 : 3,
            backgroundColor: 'white',
            overflow: 'hidden',
            marginHorizontal: 10
        }}/>);
    }
    return <View style={[defaultStyles.pinContainer, style]}>
        {items}
    </View>;
};
const defaultStyles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40 },
    titleContainer: { justifyContent: 'flex-start', alignItems: 'center', minHeight: 100, textAlign: 'center', color: 'white' },
    title: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20 },
    subTitle: { textAlign: 'center', marginTop: 20, color: 'white' },
    pinContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 80 },
    buttonContainer: { justifyContent: 'flex-start', alignItems: 'center' },
    pinNumberRow: { flexDirection: 'row', marginVertical: 10 },
    error: { marginTop: 10, color: 'orange' },
    button: { marginHorizontal: 10 },
    footer: { justifyContent: 'center', alignItems: 'center', height: 100 },
    confirm: { backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginTop: 10, overflow: 'hidden', fontSize: 14 },
});
export default PinCode;
//# sourceMappingURL=PinCode.js.map