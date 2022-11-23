import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackParamList } from "../navigators"
import { Button, Input, Text, View } from "native-base"
import { colors } from "../theme"
import fonts from "../theme/fonts"
import { useStores } from "../models"
export const HomeScreen: FC<StackScreenProps<AppStackParamList, "Home">> = observer(
  function HomeScreen(_props) {
    const { navigation, route } = _props
    const {
      pembayaranStore: { fetching, getDetailPembayaran },
    } = useStores()
    const [input, setinput] = useState("")
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.textTitle}>Masukkan Nomor Pembayaran</Text>
          <Input
            value={input}
            onChangeText={(val) => setinput(val)}
            keyboardType="number-pad"
            style={{
              fontSize: fonts.size.medium,
              fontFamily: fonts.type.base,
              color: colors.black,
            }}
          />
        </View>
        <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
          <Button
            isLoading={fetching}
            onPress={() => getDetailPembayaran({ id: input, navigation: navigation })}
            style={{ backgroundColor: colors.blue }}
          >
            <Text
              style={[
                { fontSize: fonts.size.medium, fontFamily: fonts.type.base, color: colors.white },
              ]}
            >
              Lanjut
            </Text>
          </Button>
        </View>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: { marginTop: 30, flex: 1, paddingHorizontal: 15 },
  textTitle: {
    fontSize: fonts.size.regular - 1,
    fontFamily: fonts.type.base,
    color: colors.black,
    marginBottom: 10,
  },
})
