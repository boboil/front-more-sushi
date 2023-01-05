export const assetIcon = (src, ext = 'svg') => {
    try {
        return require(`@/assets/img/icons/${src}.${ext}?raw`)
    } catch {
        return ''
    }
}
export const assetImage = (src, ext = 'svg') => {
    try {
        return require(`@/assets/img/${src}.${ext}?raw`)
    } catch {
        return ''
    }
}