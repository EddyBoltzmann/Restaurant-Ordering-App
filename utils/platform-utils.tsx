import { Platform, Dimensions, PixelRatio } from "react-native"

export const isIOS = Platform.OS === "ios"
export const isAndroid = Platform.OS === "android"

// Dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// Scale based on screen size
const widthBaseScale = SCREEN_WIDTH / 375
const heightBaseScale = SCREEN_HEIGHT / 812

export function normalize(size: number, based = "width") {
  const newSize = based === "height" ? size * heightBaseScale : size * widthBaseScale
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

// For text
export function normalizeText(size: number) {
  const scale = SCREEN_WIDTH / 375 // based on iPhone 8 scale
  const newSize = size * scale
  if (isIOS) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

// For handling different OS behaviors
export function getStatusBarHeight() {
  return isIOS ? 44 : 0
}

export function getBottomSpace() {
  return isIOS ? 34 : 0
}

export function getHeaderHeight() {
  return isIOS ? 44 : 56
}
