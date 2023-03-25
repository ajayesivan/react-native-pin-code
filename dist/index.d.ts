import PinCode from "./PinCode";
import { PinCodeT } from "./types";
declare function hasSetPIN(): Promise<boolean>;
declare function clearPIN(): Promise<void>;
export { PinCode, PinCodeT, hasSetPIN, clearPIN };
