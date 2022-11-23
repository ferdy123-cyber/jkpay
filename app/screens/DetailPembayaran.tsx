import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackParamList } from "../navigators"
import { Button, Input, ScrollView, Text, View } from "native-base"
import { colors } from "../theme"
import fonts from "../theme/fonts"
import { useStores } from "../models"
import SeparatorRibuan from "../SeparatorRibuan"
import Config from "../config"

export const DetailPembayaranScreen: FC<StackScreenProps<AppStackParamList, "DetailPembayaran">> =
  observer(function DetailPembayaranScreen(_props) {
    const { navigation, route } = _props
    const {
      pembayaranStore: { fetching, detailPembayaran, submitPembayaran },
    } = useStores()
    return (
      <View style={styles.container}>
        {detailPembayaran && (
          <>
            <ScrollView style={styles.body}>
              <Text style={styles.textTitle}>Nomor Transaksi</Text>
              <Text style={styles.value}>{detailPembayaran.nomor_transaksi}</Text>
              <Text style={styles.textTitle}>Alamat Tujuan</Text>
              <Text style={styles.value}>{detailPembayaran.alamat_tujuan}</Text>
              <Text style={styles.textTitle}>Tanggal Chekout</Text>
              <Text style={styles.value}>{detailPembayaran.tanggal}</Text>
              <Text style={styles.textTitle}>Total</Text>
              <Text style={styles.value}>Rp{SeparatorRibuan(detailPembayaran.total_price)}</Text>
              <Text style={styles.textTitle}>List Produk</Text>
              {detailPembayaran.produk.map((e: any) => {
                return (
                  <View
                    key={e.id}
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Image
                      source={{ uri: Config.API_BASE + `${e.image}` }}
                      style={{
                        width: 80,
                        height: 80,
                        resizeMode: "cover",
                        borderRadius: 10,
                        marginRight: 10,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.type.base, fontSize: fonts.size.medium }}>
                        {e.name} x {e.quantity}
                      </Text>
                    </View>
                  </View>
                )
              })}
              <View style={{ height: 20 }}></View>
            </ScrollView>
            <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
              <Button
                isLoading={fetching}
                onPress={() =>
                  submitPembayaran({ id: detailPembayaran.id, navigation: navigation })
                }
                style={{ backgroundColor: colors.blue }}
              >
                <Text
                  style={[
                    {
                      fontSize: fonts.size.medium,
                      fontFamily: fonts.type.bold,
                      color: colors.white,
                    },
                  ]}
                >
                  Bayar
                </Text>
              </Button>
            </View>
          </>
        )}
      </View>
    )
  })

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: { marginTop: 30, flex: 1, paddingHorizontal: 15 },
  textTitle: {
    fontSize: fonts.size.medium,
    fontFamily: fonts.type.bold,
    color: colors.black,
    marginBottom: 5,
    marginTop: 10,
  },
  value: {
    color: colors.blue,
    fontFamily: fonts.type.base,
    fontSize: fonts.size.medium + 1,
  },
})
