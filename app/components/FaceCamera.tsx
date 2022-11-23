// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { useCameraDevices, useFrameProcessor } from "react-native-vision-camera"
import { color, runOnJS } from "react-native-reanimated"
import { Camera } from "react-native-vision-camera"
import { scanFaces, Face } from "vision-camera-face-detector"
import Toast from "./Toast"
import { Box, Text } from "native-base"
import fonts from "../theme/fonts"

export interface FaceCameraProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  navigation?: any
  onOk?: any
  isActive: boolean
}

/**
 * Describe your component here
 */
export const FaceCamera = observer(function FaceCamera(props: FaceCameraProps) {
  const { style, navigation, onOk, isActive } = props
  const camera = React.useRef<Camera>(null)
  const $styles = Object.assign({}, $container, style)
  const [faces, setFaces] = React.useState<Face[]>()
  const [presentase, setPresentase] = React.useState(0)
  const devices = useCameraDevices()
  const device = devices.front
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
  const takeFoto = async () => {
    try {
      const photo = await camera.current.takePhoto({
        enableAutoStabilization: true,
        qualityPrioritization: "speed",
        skipMetadata: true,
      })
      onOk(photo)
    } catch (err) {
      Toast({
        type: "error",
        description: "Ada masalah saat mengambil gambar",
      })
      console.log(err)
    }
  }
  React.useEffect(() => {
    if (faces && faces.length && isActive) {
      if (presentase >= 100) {
        takeFoto()
      } else {
        setPresentase(presentase + 20)
      }
      return
    }
    setPresentase(0)
  }, [faces])
  React.useEffect(() => {
    getRequestCameraPermission()
  }, [])
  const frameProcessor = useFrameProcessor((frame) => {
    "worklet"
    const scannedFaces = scanFaces(frame)
    runOnJS(setFaces)(scannedFaces)
  }, [])
  return (
    <>
      <Text
        style={{
          fontFamily: fonts.type.bold,
          color:
            (presentase < 40 && colors.red) ||
            (presentase < 95 && colors.yellow) ||
            (presentase == 100 && colors.green),
          fontSize: fonts.size.regular,
          width: "85%",
          marginTop: -35,
          marginBottom: 15,
          textAlign: "center",
          alignSelf: "center",
        }}
      >
        {presentase > 0 ? presentase + "%" : null}
      </Text>
      {device && (
        <Box
          shadow={"5"}
          style={{
            backgroundColor: colors.blue,
            elevation: 5,
            width: "85%",
            maxWidth: 550,
            maxHeight: 550,
            aspectRatio: 1 / 1,
            borderRadius: 550,
            padding: 3,
          }}
        >
          <View
            style={{
              overflow: "hidden",
              width: "100%",
              height: "100%",
              borderRadius: 550,
            }}
          >
            <Camera
              ref={camera}
              photo={true}
              style={{
                width: "100%",
                height: "100%",
              }}
              device={device}
              isActive={isActive}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
          </View>
        </Box>
      )}
      <Text
        style={{
          fontFamily: fonts.type.base,
          color: colors.black,
          fontSize: fonts.size.medium,
          width: "85%",
          marginTop: 25,
          textAlign: "center",
          alignSelf: "center",
        }}
      >
        Posisikan wajah mu di lingkaran dan tunggu hingga terverifikasi
      </Text>
    </>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
