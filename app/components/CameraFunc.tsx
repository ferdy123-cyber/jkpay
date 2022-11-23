// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { Image, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, metrics, typography } from "../theme"
import { useCameraDevices, Camera, TemporaryFile } from "react-native-vision-camera"
import Toast from "./Toast"
import { Box, Button, Icon, Text } from "native-base"
import fonts from "../theme/fonts"
import { MaterialIcons } from "@expo/vector-icons"
import { ModalLoading } from "./ModalLoading"

export interface CameraProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  onOk: any
}

/**
 * Describe your component here
 */
export const CameraFunc = observer(function CameraFunc(props: CameraProps) {
  const { style, onOk } = props
  const $styles = Object.assign({}, $container, style)

  const camera = React.useRef<Camera>(null)

  const devices = useCameraDevices()
  const device = devices.back
  const getRequestCameraPermission = async () => {
    const newCameraPermission = await Camera.getCameraPermissionStatus()
    if (newCameraPermission == "denied") {
      Toast({
        type: "error",
        description: "Akses kamera ditolak",
      })
    }
  }
  React.useEffect(() => {
    getRequestCameraPermission()
  }, [])

  const [flash, setflash] = React.useState(false)
  const [fetching, setfetching] = React.useState(false)
  const [image, setImage] = React.useState(null)

  const takeFoto = async () => {
    try {
      setfetching(true)
      const photo = await camera.current.takePhoto({
        flash: flash ? "on" : "off",
        enableAutoStabilization: true,
        qualityPrioritization: "speed",
        skipMetadata: true,
      })
      setfetching(false)
      setImage(photo)
    } catch (err) {
      Toast({
        type: "error",
        description: "Ada masalah saat mengambil gambar",
      })
      console.log(err)
    }
  }

  // console.log(image)

  return (
    <Box style={{ flex: 1, position: "relative" }}>
      <ModalLoading visible={fetching} />
      <View style={styles.header}>
        <Text fontSize={"xl"} style={styles.title}>
          Foto Kejadian
        </Text>
        {image ? (
          <Icon
            onPress={() => onOk(image)}
            as={MaterialIcons}
            name={"check"}
            size={"xl"}
            color={colors.blue}
            // mr={3}
          />
        ) : (
          <Icon
            onPress={() => setflash(!flash)}
            as={MaterialIcons}
            name={flash ? "flash-on" : "flash-off"}
            size={"lg"}
            color={colors.blue}
            // mr={3}
          />
        )}
      </View>
      {device && image === null && (
        <View style={{ flex: 1, backgroundColor: "red", position: "relative" }}>
          <Camera
            ref={camera}
            photo={true}
            device={device}
            isActive={true}
            style={{ width: "100%", height: "100%" }}
            fps={240}
            enableZoomGesture={true}
            // orientation={"portraitUpsideDown"}
          />
          <Button
            variant={"outline"}
            backgroundColor={"light.50"}
            borderWidth={3}
            onPress={takeFoto}
            style={{
              position: "absolute",
              bottom: 20,
              alignSelf: "center",
              width: 70,
              height: 70,
              borderRadius: 35,
            }}
          >
            {/* <Text>okokokok</Text> */}
          </Button>
        </View>
      )}
      {image && (
        <Image source={{ uri: `file://${image.path}` }} style={{ width: "100%", height: "100%" }} />
      )}
    </Box>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: metrics.paddingTop,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    height: 40,
    zIndex: 99,
  },
  title: {
    fontFamily: fonts.type.bold,
    color: colors.blue,
    marginRight: "auto",
  },
  helpIconView: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  helpIcon: { width: 25, height: 25, resizeMode: "contain" },
})
