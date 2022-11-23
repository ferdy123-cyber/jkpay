// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Box, Text, View } from "native-base"
import { Camera, useCameraDevices } from "react-native-vision-camera"
import Toast from "./Toast"
import { useScanBarcodes, BarcodeFormat } from "vision-camera-code-scanner"
// import Svg, { Defs, Mask, Rect } from "react-native-svg"
import BarcodeMask from "react-native-barcode-mask"
import fonts from "../theme/fonts"
import { useStores } from "../models"

export interface ScanQrProps {
  /**
   * An optional style override useful for padding & margin.
   */
  // style?: StyleProp<ViewStyle>
  title: string
  torch: "on" | "off"
  navigation: any
  route: string
}

/**
 * Describe your component here
 */
export const ScanQr = observer(function ScanQr(props: ScanQrProps) {
  const { navigation, torch, title, route } = props
  const {
    aktifitasStore: { detailKolam, resetDetailKolam },
  } = useStores()
  const devices = useCameraDevices()
  const device = devices.back
  const getRequestCameraPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission()
    if (newCameraPermission == "denied") {
      Toast({
        type: "error",
        description: "Akses kamera ditolak",
      })
      navigation.goBack()
    }
  }
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  })
  React.useEffect(() => {
    getRequestCameraPermission()
  }, [])

  const [isScanned, setIsScanned] = React.useState(false)

  if (barcodes && barcodes.length > 0 && barcodes[0].rawValue && isScanned === false) {
    setIsScanned(true)
    resetDetailKolam()
    // console.log(barcodes[0])
    navigation.replace(route, {
      mkolamId: barcodes[0].rawValue,
    })
  }

  // console.log(detailKolam)

  return (
    <Box style={{ flex: 1, position: "relative" }}>
      {device && (
        <Camera
          device={device}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
          isActive={true}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          torch={torch}
        />
      )}
      <Text
        style={{
          color: colors.white,
          zIndex: 999,
          maxWidth: 300,
          textAlign: "center",
          alignSelf: "center",
          position: "absolute",
          top: 50,
          fontFamily: fonts.type.bold,
          fontSize: fonts.size.input - 1,
        }}
      >
        Pindai Kode QR untuk pengisian form {title}
      </Text>
      <BarcodeMask edgeColor={colors.white} showAnimatedLine={false} width={300} height={300} />
    </Box>
  )
})
