export var PinCodeT;
(function (PinCodeT) {
    let Modes;
    (function (Modes) {
        Modes["Enter"] = "enter";
        Modes["Set"] = "set";
        Modes["Locked"] = "locked";
        Modes["Reset"] = "reset";
    })(Modes = PinCodeT.Modes || (PinCodeT.Modes = {}));
    let Statuses;
    (function (Statuses) {
        Statuses["Initial"] = "initial";
        Statuses["SetOnce"] = "set.once";
        Statuses["ResetPrompted"] = "reset.prompted";
        Statuses["ResetSucceeded"] = "reset.succeeded";
    })(Statuses = PinCodeT.Statuses || (PinCodeT.Statuses = {}));
})(PinCodeT || (PinCodeT = {}));
export const DEFAULT = {
    Options: {
        pinLength: 4,
        allowReset: true,
        disableLock: false,
        lockDuration: 600000,
        maxAttempt: 10
    },
    TextOptions: {
        enter: {
            title: 'Enter PIN',
            subTitle: 'Enter {{pinLength}}-digit PIN to access.',
            error: 'Wrong PIN! Try again.',
            backSpace: 'Delete',
            footerText: 'Forgot PIN?'
        },
        set: {
            title: 'Set up a new PIN',
            subTitle: 'Enter {{pinLength}} digits.',
            repeat: 'Enter new PIN again.',
            error: `PIN don't match. Start the process again.`,
            cancel: 'Cancel'
        },
        locked: {
            title: 'Locked',
            subTitle: `Your have entered wrong PIN {{maxAttempt}} times.\nThe app is temporarily locked in {{lockDuration}}.`,
            lockedText: 'Locked',
        },
        reset: {
            title: 'Forgot PIN?',
            subTitle: `Remove the PIN may wipe out the app data and settings.`,
            resetButton: 'Remove',
            confirm: 'Are you sure you want remove the PIN?',
            confirmButton: 'Confirm',
            backButton: 'Back'
        }
    }
};
export const PIN_KEY = '@pincode';
//# sourceMappingURL=types.js.map