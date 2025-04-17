import * as CryptoJS from 'crypto-js';
import { environment } from "../../../environments/environment";

export class AesEncryptionUtil {
    static encryptData(data:string):string{
        return CryptoJS.AES.encrypt(data, environment.secretkey).toString();
    }

    static decryptData(data:string):string{
        const bytes = CryptoJS.AES.decrypt(data, environment.secretkey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}