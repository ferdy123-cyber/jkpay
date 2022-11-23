// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { Image, Modal, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, images, metrics, typography } from "../theme"
import fonts from "../theme/fonts"
import { Button, Text, View } from "native-base"

export interface ModalSuccessProps {
  /**
   * An optional style override useful for padding & margin.
   */
  visible: boolean
  text: string
  onOk?: any
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ModalSuccess = observer(function ModalSuccess(props: ModalSuccessProps) {
  const { style, visible, text, onOk } = props

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      statusBarTranslucent
      onRequestClose={onOk}
    >
      <View
        style={{
          width: metrics.screenWidth,
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            width: 120,
            borderRadius: 60,
            alignItems: "center",
            height: 120,
            marginBottom: -60,
            zIndex: 99,
            justifyContent: "center",
          }}
        >
          <Image
            source={images.smileIcon}
            style={{ width: 85, height: 85, resizeMode: "contain" }}
          />
        </View>
        <View
          style={{
            backgroundColor: colors.white,
            width: "85%",
            maxWidth: 400,
            borderRadius: 10,
            alignItems: "center",
            // height: 100,
            paddingTop: 65,
          }}
        >
          <Text
            style={{
              //   width: '85%',
              textAlign: "center",
              fontFamily: fonts.type.bold,
              fontSize: fonts.size.medium,
              color: colors.blue,
              marginBottom: 20,
            }}
          >
            Yeayy!!
          </Text>
          <Text
            style={{
              width: "85%",
              textAlign: "center",
              fontFamily: fonts.type.base,
              fontSize: fonts.size.small,
              color: colors.blue,
              marginBottom: 30,
            }}
          >
            {text}
          </Text>
          <Button
            onPress={onOk}
            style={{
              alignSelf: "center",
              // height: 35,
              marginBottom: -17.5,
              //   borderRadius: 10,
              backgroundColor: colors.blue,
              //   paddingHorizontal: 15,
              overflow: "hidden",
              width: 90,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.type.base,
                fontSize: fonts.size.small,
                color: colors.white,
                textTransform: "capitalize",
              }}
            >
              Oke
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
})
