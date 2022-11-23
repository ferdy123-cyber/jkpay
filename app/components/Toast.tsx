// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { Box, Icon, Text, Toast as ToastComponent, View } from "native-base"
import fonts from "../theme/fonts"
import { colors, metrics } from "../theme"
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons"
import { SvgXml } from "react-native-svg"

export interface ToastProps {
  /**
   * An optional style override useful for padding & margin.
   */
  description: string
  type: string
  duration?: number
}

/**
 * Describe your component here
 */
const Toast = function Toast(props: ToastProps) {
  const { description, type, duration } = props
  ToastComponent.show({
    duration: duration ? duration : 3000,
    placement: "top",
    // description: description,
    // borderRadius: 10,
    backgroundColor: "secondary.100",
    fontFamily: fonts.type.base,
    render: () => (
      <Box
        shadow={"9"}
        style={{
          backgroundColor: type == "error" ? "#ffe4e6" : "#dbf4ff",
          width: metrics.screenWidth - 30,
          maxWidth: 550,
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          borderRadius: 10,
          elevation: 2,
          borderColor: type == "error" ? colors.red : colors.blue,
          borderWidth: 0.5,
          flexDirection: "row",
          minHeight: 50,
        }}
      >
        <Icon
          as={<FontAwesome name={type == "error" ? "warning" : "check"} />}
          size={4}
          // mr="2"
          color={type == "error" ? "#9f1239" : colors.blue}
        />
        <View style={{ flex: 1, marginRight: 10, marginLeft: 10 }}>
          <Text
            lineHeight={"sm"}
            style={{
              fontFamily: fonts.type.base,
              fontSize: fonts.size.small,
              color: type == "error" ? "#9f1239" : colors.blue,
              textAlign: "left",
            }}
          >
            {description}
          </Text>
        </View>
        {/* <Icon
          onPress={() => ToastComponent.closeAll()}
          as={<FontAwesome5 name={"times"} />}
          size={4}
          // mr="2"
          color={type == "error" ? "#9f1239" : colors.blue}
        /> */}
      </Box>
    ),
  })
}

export default Toast
