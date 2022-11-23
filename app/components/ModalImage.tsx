// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { Image, Modal, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { metrics } from "../theme"

export interface ModalImageProps {
  /**
   * An optional style override useful for padding & margin.
   */
  visible: boolean
  onRequestClose: any
  image: any
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ModalImage = observer(function ModalImage(props: ModalImageProps) {
  const { visible, style, onRequestClose, image } = props

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
        <Image
          source={image}
          style={{
            width: metrics.screenWidth,
            height: metrics.screenHeight,
            resizeMode: "contain",
          }}
        />
      </View>
    </Modal>
  )
})
