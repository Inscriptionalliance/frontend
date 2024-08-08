import CryptoJS from 'crypto-js'
const key = CryptoJS.enc.Hex.parse('de2011d34725bd12175ac7e87111ff2d');  //-
const iv = CryptoJS.enc.Hex.parse('de2011d34725bd12175ac7e87111ff2d');  
    
//-
function Decrypt(data:string) {
    var decrypt = CryptoJS.AES.decrypt(data, key, {
        mode : CryptoJS.mode.ECB,
        padding : CryptoJS.pad.Pkcs7
    });
    var result = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
    return result;
}

//-
function Encrypt(word:any) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}
export {
    Decrypt ,
    Encrypt
}