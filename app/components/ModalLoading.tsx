// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { Modal, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, metrics } from "../theme"
import { View, Spinner, Text } from "native-base"
import fonts from "../theme/fonts"

export interface ModalLoadingProps {
  /**
   * An optional style override useful for padding & margin.
   */
  visible: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ModalLoading = observer(function ModalLoading(props: ModalLoadingProps) {
  const { visible, style } = props

  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      visible={visible}
      onRequestClose={() => {}}
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
            width: 170,
            borderRadius: 35,
            alignItems: "center",
            // height: 100,
            justifyContent: "center",
          }}
        >
          <Spinner size={"lg"} style={{ marginTop: 15, marginBottom: 20 }} color={colors.blue} />
          <Text
            style={{
              fontFamily: fonts.type.bold,
              fontSize: fonts.size.regular,
              marginBottom: 15,
              color: colors.black,
            }}
          >
            Loading...
          </Text>
        </View>
      </View>
    </Modal>
  )
})
