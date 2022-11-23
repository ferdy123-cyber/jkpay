// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Input, Text } from "native-base"
import fonts from "../theme/fonts"

export interface OtpInputProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  value?: string
  onChange?: any
}

/**
 * Describe your component here
 */
export const OtpInput = observer(function OtpInput(props: OtpInputProps) {
  const { style, value, onChange } = props
  const $styles = Object.assign({}, $container, style)

  const [input, setInput] = React.useState([0, 0, 0, 0, 0, 0])
  // const [idx, setIdx] = React.useState(null)

  // const [otp, setOtp] = React.useState("")

  return (
    <View
      style={{
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {input.map((e, index) => {
        return (
          <View
            style={{
              flex: 1,
              height: "100%",
              borderBottomColor: colors.blue,
              borderBottomWidth: 1,
              marginRight: 5,
              marginLeft: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            key={index}
          >
            <Text
              style={{
                fontFamily: fonts.type.bold,
                fontSize: fonts.size.medium,
                color: colors.blue,
              }}
            >
              {value[index] ? value[index] : "-"}
            </Text>
          </View>
        )
      })}
      <View
        style={{
          position: "absolute",
          backgroundColor: "red",
          width: 300,
          height: "100%",
          opacity: 0,
        }}
      >
        <Input
          keyboardType="number-pad"
          value={value}
          onChangeText={onChange}
          maxLength={6}
          isFocused={true}
          style={{ height: 70 }}
        />
      </View>
    </View>
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
