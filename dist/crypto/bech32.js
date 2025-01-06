/**
 * @file Bech32 encoding/decoding utilities
 * @module crypto/bech32
 */
const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
/**
 * Convert 5-bit groups to base32
 */
function toChars(data) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
        result += CHARSET.charAt(data[i]);
    }
    return result;
}
/**
 * Convert string to 5-bit groups
 */
function fromChars(str) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        const index = CHARSET.indexOf(str.charAt(i));
        if (index === -1)
            throw new Error(`Invalid character: ${str.charAt(i)}`);
        result.push(index);
    }
    return result;
}
/**
 * Compute checksum
 */
function polymod(values) {
    let chk = 1;
    for (let p = 0; p < values.length; p++) {
        const top = chk >> 25;
        chk = (chk & 0x1ffffff) << 5 ^ values[p];
        for (let i = 0; i < 5; i++) {
            if ((top >> i) & 1) {
                chk ^= GENERATOR[i];
            }
        }
    }
    return chk;
}
/**
 * Expand human-readable part
 */
function expandHRP(hrp) {
    const result = [];
    for (let i = 0; i < hrp.length; i++) {
        result.push(hrp.charCodeAt(i) >> 5);
    }
    result.push(0);
    for (let i = 0; i < hrp.length; i++) {
        result.push(hrp.charCodeAt(i) & 31);
    }
    return result;
}
/**
 * Verify checksum
 */
function verifyChecksum(hrp, data) {
    return polymod(expandHRP(hrp).concat(data)) === 1;
}
/**
 * Create checksum
 */
function createChecksum(hrp, data) {
    const values = expandHRP(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
    const mod = polymod(values) ^ 1;
    const result = [];
    for (let p = 0; p < 6; p++) {
        result.push((mod >> 5 * (5 - p)) & 31);
    }
    return result;
}
/**
 * Convert data to 5-bit groups
 */
function convertBits(data, frombits, tobits, pad) {
    let acc = 0;
    let bits = 0;
    const result = [];
    const maxv = (1 << tobits) - 1;
    for (let i = 0; i < data.length; i++) {
        const value = data[i];
        if (value < 0 || value >> frombits !== 0) {
            throw new Error('Invalid value');
        }
        acc = (acc << frombits) | value;
        bits += frombits;
        while (bits >= tobits) {
            bits -= tobits;
            result.push((acc >> bits) & maxv);
        }
    }
    if (pad) {
        if (bits > 0) {
            result.push((acc << (tobits - bits)) & maxv);
        }
    }
    else if (bits >= frombits || ((acc << (tobits - bits)) & maxv)) {
        throw new Error('Invalid padding');
    }
    return result;
}
/**
 * Encode data to bech32
 */
export function bech32Encode(hrp, data) {
    const combined = data.concat(createChecksum(hrp, data));
    return hrp + '1' + toChars(combined);
}
/**
 * Decode bech32 string
 */
export function bech32Decode(str) {
    if (str.length < 8 || str.length > 90) {
        throw new Error('Invalid length');
    }
    let lower = false;
    let upper = false;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) < 33 || str.charCodeAt(i) > 126) {
            throw new Error('Invalid character');
        }
        if (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122)
            lower = true;
        if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90)
            upper = true;
    }
    if (lower && upper) {
        throw new Error('Mixed case');
    }
    const pos = str.lastIndexOf('1');
    if (pos < 1 || pos + 7 > str.length) {
        throw new Error('Invalid separator position');
    }
    const hrp = str.substring(0, pos).toLowerCase();
    const data = fromChars(str.substring(pos + 1));
    if (!verifyChecksum(hrp, data)) {
        throw new Error('Invalid checksum');
    }
    return { hrp, data: data.slice(0, -6) };
}
/**
 * Encode hex string to bech32
 */
export function encodeToBech32(hrp, hex) {
    const data = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    const words = convertBits(Array.from(data), 8, 5, true);
    return bech32Encode(hrp, words);
}
/**
 * Decode bech32 to hex string
 */
export function decodeFromBech32(str) {
    const { hrp, data } = bech32Decode(str);
    const bytes = convertBits(data, 5, 8, false);
    const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    return { prefix: hrp, hex };
}
//# sourceMappingURL=bech32.js.map