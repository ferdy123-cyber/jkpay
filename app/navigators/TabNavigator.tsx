import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors, spacing } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { AbsenScreen, AkunScreen, AktifitasScreen, RiwayatScreen } from "../screens"
import { SvgXml } from "react-native-svg"
import { View } from "native-base"
import fonts from "../theme/fonts"
import { useStores } from "../models"

export type TabParamList = {
  Absen: undefined
  Akun: undefined
  Aktifitas: undefined
  Riwayat: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<TabParamList>()

export function TabNavigator() {
  const { bottom } = useSafeAreaInsets()
  // console.log(bottom)
  const {
    authenticationStore: { role_name },
  } = useStores()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { height: 55, backgroundColor: colors.white },
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.blueDisable,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Aktifitas"
        component={AktifitasScreen}
        options={{
          tabBarLabel: "Aktifitas",
          tabBarIcon: (tabinfo) => (
            <View
              style={{
                marginTop: -10,
              }}
            >
              <SvgXml
                xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.68551 6.92429C7.61858 7.80205 6.90579 9.03664 6.67909 10.3995L5.92856 14.9116C5.75529 15.9533 6.96652 16.6526 7.78201 15.9817L11.3143 13.0757C12.3813 12.1979 13.0941 10.9633 13.3208 9.60046L14.0713 5.08835C14.2446 4.04666 13.0333 3.34736 12.2178 4.01826L8.68551 6.92429Z" fill=${
              tabinfo.focused ? colors.blue : colors.blueDisable
            }/>
            <path d="M8.28572 10C8.28572 9.05323 9.05323 8.28572 10 8.28572C10.9468 8.28572 11.7143 9.05323 11.7143 10C11.7143 10.9468 10.9468 11.7143 10 11.7143C9.05323 11.7143 8.28572 10.9468 8.28572 10Z" fill=${
              tabinfo.focused ? colors.blue : colors.blueDisable
            }/>
            </svg>        
            `}
                width={35}
                height={25}
              />
            </View>
          ),
        }}
      />

      {role_name === "PEKERJA_FARM" && (
        <Tab.Screen
          name="Absen"
          component={AbsenScreen}
          options={{
            tabBarLabel: "Absen",
            tabBarIcon: (tabinfo) => (
              <View
                style={{
                  marginTop: -10,
                }}
              >
                <SvgXml
                  xml={`<svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 2.75C3.75 1.23122 4.98122 0 6.5 0H8.5C10.0188 0 11.25 1.23122 11.25 2.75V4.75C11.25 5.16421 10.9142 5.5 10.5 5.5H4.5C4.08579 5.5 3.75 5.16421 3.75 4.75V2.75ZM6.5 1.5C5.80964 1.5 5.25 2.05964 5.25 2.75V4H9.75V2.75C9.75 2.05964 9.19036 1.5 8.5 1.5H6.5Z" fill=${
                  tabinfo.focused ? colors.blue : colors.blueDisable
                }/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.98693 2.67877C2.11335 2.61816 2.25371 2.71463 2.25346 2.85483L2.25 4.75001C2.25 5.99265 3.25736 7.00001 4.5 7.00001H10.5C11.7426 7.00001 12.75 5.99265 12.75 4.75001V2.85426C12.75 2.71422 12.8903 2.618 13.0165 2.67855C14.2016 3.24669 15 4.45679 15 5.83546V16.3249C15 18.0357 13.7257 19.4785 12.028 19.6899C9.02096 20.0644 5.97904 20.0644 2.97197 19.6899C1.27431 19.4785 0 18.0357 0 16.3249V5.83545C0 4.45697 0.801611 3.24701 1.98693 2.67877ZM10.5 9.75C10.9142 9.75 11.25 10.0858 11.25 10.5C11.25 10.9142 10.9142 11.25 10.5 11.25H4.5C4.08579 11.25 3.75 10.9142 3.75 10.5C3.75 10.0858 4.08579 9.75 4.5 9.75H10.5ZM9.5 12.75C9.91421 12.75 10.25 13.0858 10.25 13.5C10.25 13.9142 9.91421 14.25 9.5 14.25H4.5C4.08579 14.25 3.75 13.9142 3.75 13.5C3.75 13.0858 4.08579 12.75 4.5 12.75H9.5Z" fill=${
                  tabinfo.focused ? colors.blue : colors.blueDisable
                }/>
                </svg>              
                `}
                  width={35}
                  height={25}
                />
              </View>
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Riwayat"
        component={RiwayatScreen}
        options={{
          tabBarLabel: "Riwayat",
          tabBarIcon: (tabinfo) => (
            <View
              style={{
                marginTop: -10,
              }}
            >
              <SvgXml
                xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.13098 4.15126C5.63215 2.64493 7.70658 1.71429 10 1.71429C14.5761 1.71429 18.2857 5.42393 18.2857 10C18.2857 14.5761 14.5761 18.2857 10 18.2857C5.42393 18.2857 1.71429 14.5761 1.71429 10C1.71429 9.52661 1.33053 9.14286 0.857143 9.14286C0.383756 9.14286 0 9.52661 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C7.23258 0 4.72637 1.12528 2.91672 2.94117C2.88764 2.97035 2.86109 3.00111 2.83708 3.03316L1.39986 1.59594C1.24308 1.43916 1.00975 1.38722 0.80127 1.4627C0.592789 1.53818 0.446791 1.72745 0.426717 1.94826L0.0226559 6.39294C0.00730208 6.56183 0.0677597 6.72881 0.187677 6.84873C0.307594 6.96865 0.474581 7.02911 0.643473 7.01375L5.08814 6.60969C5.30896 6.58962 5.49823 6.44362 5.57371 6.23514C5.64919 6.02666 5.59725 5.79333 5.44047 5.63655L4.03691 4.23299C4.06973 4.20841 4.10119 4.18116 4.13098 4.15126Z" fill=${
                  tabinfo.focused ? colors.blue : colors.blueDisable
                }/>
                <path d="M10.8571 4.28571C10.8571 3.81233 10.4734 3.42857 10 3.42857C9.52661 3.42857 9.14286 3.81233 9.14286 4.28571V10C9.14286 10.2955 9.2951 10.5702 9.54572 10.7269L12.9743 12.8697C13.3757 13.1206 13.9045 12.9986 14.1554 12.5971C14.4063 12.1957 14.2843 11.6669 13.8829 11.416L10.8571 9.52493V4.28571Z" fill=${
                  tabinfo.focused ? colors.blue : colors.blueDisable
                }/>
                </svg>               
                `}
                width={35}
                height={25}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Akun"
        component={AkunScreen}
        options={{
          tabBarLabel: "Akun",
          tabBarIcon: (tabinfo) => (
            <View
              style={{
                marginTop: -10,
              }}
            >
              <SvgXml
                xml={`<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 0C6.96127 0 4.90323 2.03766 4.90323 4.55123C4.90323 7.06481 6.96127 9.10246 9.5 9.10246C12.0387 9.10246 14.0968 7.06481 14.0968 4.55123C14.0968 2.03766 12.0387 0 9.5 0Z" fill=${
                  tabinfo.focused ? colors.blue : colors.blueDisable
                }/>
                <path d="M4.59677 11.5298C2.05805 11.5298 0 13.5674 0 16.081V17.5232C0 18.4374 0.669148 19.2168 1.5804 19.3641C6.82541 20.212 12.1746 20.212 17.4196 19.3641C18.3309 19.2168 19 18.4374 19 17.5232V16.081C19 13.5674 16.942 11.5298 14.4032 11.5298H13.9854C13.7592 11.5298 13.5345 11.5652 13.3195 11.6347L12.2586 11.9777C10.4661 12.5572 8.53391 12.5572 6.74143 11.9777L5.68048 11.6347C5.46549 11.5652 5.24077 11.5298 5.01461 11.5298H4.59677Z" fill=${
                  tabinfo.focused ? colors.blue : colors.blueDisable
                }/>
                </svg>                
                `}
                width={35}
                height={25}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.medium,
}

const $tabBarLabel: TextStyle = {
  fontSize: 11,
  fontFamily: fonts.type.base,
  lineHeight: 16,
  // flex: 1,
  // backgroundColor: "red",
}

// @demo remove-file
