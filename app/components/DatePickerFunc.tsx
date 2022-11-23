// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"

export interface DatePickerFuncProps {
  /**
   * An optional style override useful for padding & margin.
   */
  onSubmit: any
}

/**
 * Describe your component here
 */
const DatePickerFunc = function DatePickerFunc(props: DatePickerFuncProps) {
  const { onSubmit } = props
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate
    console.log(currentDate)
  }
  DateTimePickerAndroid.open({
    value: new Date(),
    onChange,
    mode: "date",
    is24Hour: true,
  })
}

export default DatePickerFunc
