// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import {
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { observer } from "mobx-react-lite"
import { Box, FlatList, Icon, Input, Text } from "native-base"
import { FontAwesome } from "@expo/vector-icons"

export interface PickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  underline?: boolean
  underlineColor?: string
  data: any[]
  label: string
  valueStyle?: any
  iconColor?: string
  onChange?: any
  valueKey: string | number
  value: string
}

/**
 * Describe your component here
 */
export const Picker = observer(function Picker(props: PickerProps) {
  const {
    underline,
    underlineColor,
    data,
    label,
    valueStyle,
    iconColor,
    onChange,
    valueKey,
    value,
  } = props
  const [search, setsearch] = React.useState("")
  // const [labelShow, setlabelShow] = React.useState("")
  const [visible, setVisible] = React.useState(false)
  // console.log(
  //   data.filter((e) => e[valueKey] === value).length !== 0 &&
  //     data.filter((e) => e[valueKey] === value)[0][label],
  // )
  const filter = valueKey
    ? data.filter((e) => e[valueKey] === value)
    : data.filter((e) => e === value)
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        visible={visible}
        onRequestClose={() => {
          setVisible(false)
        }}
      >
        <KeyboardAvoidingView style={styles.modalView} behavior="padding">
          <Box
            shadow={5}
            style={{
              width: "100%",
              maxHeight: "80%",
              backgroundColor: "white",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              paddingHorizontal: 15,
              // minHeight: 140,
            }}
          >
            <View style={{ paddingTop: 20 }}>
              <Input
                placeholder="Cari..."
                value={search}
                borderRadius={10}
                borderWidth={1.5}
                InputRightElement={<Icon as={FontAwesome} name="search" size={"md"} mr={"1.5"} />}
                mb={"1.5"}
                onChangeText={(val) => setsearch(val)}
                style={{ fontSize: 14 }}
              />
            </View>
            <FlatList
              style={{ paddingBottom: 20 }}
              data={data.filter((val) => {
                if (search === "") {
                  return val
                } else {
                  return val[label].toLowerCase().includes(search.toLowerCase())
                }
              })}
              keyExtractor={({ item, index }) => index}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index + index}
                  onPress={() => {
                    // setlabelShow(label ? item[label] : item)
                    onChange(item)
                    setVisible(false)
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 5 }}
                >
                  <Text style={[valueStyle, { fontSize: 13 }]}>{label ? item[label] : item}</Text>
                </TouchableOpacity>
              )}
            />
          </Box>
        </KeyboardAvoidingView>
      </Modal>
      <Input
        value={filter.length !== 0 && filter[0][label]}
        InputRightElement={
          <Icon
            onPress={() => setVisible(true)}
            as={FontAwesome}
            name="caret-down"
            size={"lg"}
            color={iconColor ? iconColor : "black"}
            paddingLeft={"1.5"}
          />
        }
        borderBottomColor={underlineColor ? underlineColor : "black"}
        style={valueStyle}
        variant={underline ? "underlined" : "unstyled"}
        isDisabled
        _disabled={{
          opacity: 1,
        }}
      />
    </>
  )
})

const styles = StyleSheet.create({
  modalView: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
})
