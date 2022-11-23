// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import { StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, metrics, typography } from "../theme"
import DateField from "react-native-datefield"
import fonts from "../theme/fonts"
import { Text, View } from "native-base"
import moment from "moment"
import DateTimePicker from "@react-native-community/datetimepicker"

export interface DatePickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  // onClose?: any
  // onSubmit?: any
  // visible?: boolean
  // style?: StyleProp<ViewStyle>
  onChange?: any
  value?: any
}

/**
 * Describe your component here
 */
export const DatePicker = observer(function DatePicker(props: DatePickerProps) {
  const {
    // style, onClose, onSubmit, visible,
    onChange,
    value,
  } = props
  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={value ? value : new Date()}
      mode={"date"}
      is24Hour={true}
      onChange={onChange}
      minimumDate={new Date()}
    />
    // <Modal
    //   animationType="fade"
    //   transparent={true}
    //   visible={visible}
    //   statusBarTranslucent
    //   onRequestClose={onClose}
    // >
    //   <View style={styles.modalView}>
    //     <View
    //       style={[
    //         styles.modalContainer,
    //         { paddingHorizontal: 0, paddingBottom: 15, position: "relative" },
    //       ]}
    //     >
    //       <Text style={styles.titleModal}>Pilih Tanggal</Text>
    //       <SafeAreaView style={{ width: "100%" }}>
    //         <DatePickerComponent
    //           mode="calendar"
    //           onDateChange={(datestring, date) => console.log(datestring)}
    //         />
    //         {/* <DateField
    //           labelDate="Tanggal"
    //           labelMonth="Bulan"
    //           labelYear="Tahun"
    //           defaultValue={null}
    //           placeholderTextColor={"black"}
    //           styleInput={styles.datePickStyle}
    //           onSubmit={onSubmit}
    //           minimumDate={new Date(new Date(moment().subtract(1, "days").format("YYYY-MM-DD")))}
    //           // autoFocus
    //         /> */}
    //       </SafeAreaView>
    //     </View>
    //   </View>
    // </Modal>
  )
})

const styles = StyleSheet.create({
  modalView: {
    width: metrics.screenWidth,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.white,
    width: "90%",
    maxWidth: 650,
    borderRadius: 35,
    alignItems: "center",
    overflow: "hidden",
  },
  titleModal: {
    color: colors.blue,
    fontFamily: fonts.type.bold,
    fontSize: fonts.size.regular - 1,
    marginTop: 20,
  },
  datePickStyle: {
    width: "30%",
    // borderRadius: 15,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    marginTop: 20,
    marginBottom: 15,
    fontSize: fonts.size.medium,
    fontFamily: fonts.type.base,
    color: colors.black,
    marginRight: 5,
  },
})
