// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { Image, Modal, StyleProp, StyleSheet, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, metrics } from "../theme"
import { View, Spinner, Text, Button } from "native-base"
import fonts from "../theme/fonts"

export interface ModalFaceSuccessProps {
  /**
   * An optional style override useful for padding & margin.
   */
  visible: boolean
  style?: StyleProp<ViewStyle>
  text?: string
  onRequestClose?: any
  onOk?: any
  title?: string
  data: any
  profile: any
  foto: string
}

/**
 * Describe your component here
 */
export const ModalFaceSuccess = observer(function ModalFaceSuccess(props: ModalFaceSuccessProps) {
  const { visible, style, text, onRequestClose, onOk, title, data, profile, foto } = props
  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View
        style={[
          {
            width: metrics.screenWidth,
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
          },
          style,
        ]}
      >
        <View
          style={{
            backgroundColor: colors.white,
            width: "85%",
            maxWidth: 400,
            borderRadius: 15,
            padding: 10,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.type.bold,
              fontSize: fonts.size.regular - 1,
              marginBottom: 25,
              marginTop: 10,
              paddingHorizontal: 10,
              color: colors.black,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              paddingHorizontal: 10,
              fontFamily: fonts.type.bold,
              fontSize: fonts.size.small,
              color: colors.blue,
            }}
          >
            Nama
          </Text>
          <Text
            style={{
              paddingHorizontal: 10,
              fontFamily: fonts.type.base,
              fontSize: fonts.size.medium,
              color: colors.black,
            }}
          >
            {profile.nama_lengkap}
          </Text>
          <Text
            style={{
              marginTop: 10,
              paddingHorizontal: 10,
              fontFamily: fonts.type.bold,
              fontSize: fonts.size.small,
              color: colors.blue,
            }}
          >
            Tanggal
          </Text>
          <Text
            style={{
              paddingHorizontal: 10,
              fontFamily: fonts.type.base,
              fontSize: fonts.size.medium,
              color: colors.black,
            }}
          >
            {data.tanggal}
          </Text>
          <Text
            style={{
              marginTop: 10,
              paddingHorizontal: 10,
              fontFamily: fonts.type.bold,
              fontSize: fonts.size.small,
              color: colors.blue,
            }}
          >
            Foto Wajah
          </Text>
          <View style={{ paddingHorizontal: 10, marginBottom: 10, marginTop: 5 }}>
            <Image source={{ uri: foto }} style={{ width: 100, height: 100, borderRadius: 10 }} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onPress={onRequestClose}
              style={[styles.buttonModalSuccess, { backgroundColor: colors.grey }]}
            >
              <Text lineHeight={"sm"} style={styles.textButton}>
                Batal
              </Text>
            </Button>
            <Button onPress={onOk} style={styles.buttonModalSuccess}>
              <Text lineHeight={"sm"} style={styles.textButton}>
                Absen
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  buttonModalSuccess: {
    height: 45,
    borderRadius: 15,
    backgroundColor: colors.blue,
    // flex: 1,
    marginHorizontal: 5,
    marginTop: 25,
    minWidth: 90,
    marginBottom: 5,
  },
  textButton: {
    fontFamily: fonts.type.base,
    fontSize: fonts.size.medium - 1,
    textTransform: "capitalize",
    color: colors.white,
  },
})
