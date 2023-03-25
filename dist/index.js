var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AsyncStorage from "@react-native-community/async-storage";
import PinCode from "./PinCode";
import { PinCodeT, PIN_KEY } from "./types";
function hasSetPIN() {
    return __awaiter(this, void 0, void 0, function* () {
        const pin = yield AsyncStorage.getItem(PIN_KEY);
        return (pin ? true : false);
    });
}
function clearPIN() {
    return __awaiter(this, void 0, void 0, function* () {
        yield AsyncStorage.removeItem(PIN_KEY);
    });
}
export { PinCode, PinCodeT, hasSetPIN, clearPIN };
//# sourceMappingURL=index.js.map