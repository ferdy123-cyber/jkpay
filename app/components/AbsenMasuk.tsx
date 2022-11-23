// MAVERICKTODO: update the generator template with new patterns

import * as React from "react"
import {
  Image,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, images, metrics, typography } from "../theme"
import { Text } from "./Text"
import { Calendar, LocaleConfig } from "react-native-calendars"
import moment from "moment"
import { Button, Icon, ScrollView } from "native-base"
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons"
import fonts from "../theme/fonts"

export interface AbsenMasukProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  navigation?: any
}

/**
 * Describe your component here
 */
export const AbsenMasuk = observer(function AbsenMasuk(props: AbsenMasukProps) {
  const { style, navigation } = props
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("FaceAbsenMasuk")
        }}
        style={styles.absenButton}
      >
        <Icon as={FontAwesome5} name="pen" size="lg" color={colors.white} />
      </TouchableOpacity>
      <ScrollView>
        <Calendar
          theme={theme}
          markedDates={{
            //tanggal sekarang
            [moment().format("YYYY-MM-DD")]: {
              selected: true,
              selectedColor: colors.blue,
            },

            //sudah absen
            "2022-09-16": {
              selected: true,
              selectedTextColor: "#22c55e",
              selectedColor: "transparent",
            },

            //tidak absen
            "2022-09-07": {
              selected: true,
              selectedTextColor: "#ef4444",
              selectedColor: "transparent",
            },
          }}
          initialDate={moment().format("YYYY-MM-DD")}
          minDate={moment().format("YYYY")}
          maxDate={moment().format("YYYY-MM") + "-31"}
          monthFormat={"MMMM yyyy"}
        />
        <Text style={styles.dateNow}>{moment().format("dddd, DD MMMM YYYY")}</Text>
        <View style={styles.statusAbsenView}>
          <Image source={images.noneImage} style={styles.noneImage} />
          <Text
            style={{
              fontFamily: fonts.type.base,
              fontSize: fonts.size.medium - 1,
              color: colors.grey,
            }}
          >
            Kamu belum absen masuk nih, absen dulu yuk!
          </Text>
        </View>
        <View style={{ height: 120 }}></View>
      </ScrollView>
    </>
  )
})

const styles = StyleSheet.create({
  absenButton: {
    position: "absolute",
    bottom: 40,
    right: 15,
    backgroundColor: colors.blue,
    elevation: 5,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9,
  },
  dateNow: {
    color: colors.blue,
    fontFamily: fonts.type.bold,
    fontSize: fonts.size.regular - 1,
    marginTop: 15,
    marginBottom: 15,
    alignSelf: "center",
    paddingHorizontal: 15,
  },
  statusAbsenView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  noneImage: {
    width: metrics.screenWidth / 2,
    maxWidth: 600,
    // height: 120,
    resizeMode: "contain",
    marginBottom: 5,
  },
})

const theme = {
  monthTextColor: colors.blue,
  textMonthFontFamily: fonts.type.bold,
  textMonthFontSize: fonts.size.regular - 1,
  dayTextColor: colors.black,
  textDayFontFamily: fonts.type.base,
  textDayFontSize: fonts.size.small + 1,
  textDayHeaderFontFamily: fonts.type.bold,
  textDayHeaderFontSize: fonts.size.small + 1,
  todayTextColor: colors.blue,
}

LocaleConfig.locales["id"] = {
  monthNames: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agst",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ],
  dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  today: "Hari ini",
}
LocaleConfig.defaultLocale = "id"
