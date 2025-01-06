/**
 * @file Bech32 encoding/decoding utilities
 * @module crypto/bech32
 */
/**
 * Encode data to bech32
 */
export declare function bech32Encode(hrp: string, data: number[]): string;
/**
 * Decode bech32 string
 */
export declare function bech32Decode(str: string): {
    hrp: string;
    data: number[];
};
/**
 * Encode hex string to bech32
 */
export declare function encodeToBech32(hrp: string, hex: string): string;
/**
 * Decode bech32 to hex string
 */
export declare function decodeFromBech32(str: string): {
    prefix: string;
    hex: string;
};
//# sourceMappingURL=bech32.d.ts.map