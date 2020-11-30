const hexToBase64 = (hex: string) => {
    return Buffer.from(hex, 'hex').toString('base64');
}

const base64ToHex = (base64: string) => {
    return Buffer.from(base64, 'base64').toString('hex');
}

export { hexToBase64, base64ToHex }