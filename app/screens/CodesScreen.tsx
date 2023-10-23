import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { spacing } from "app/theme"

interface CodesScreenProps extends AppStackScreenProps<"Codes"> {}

export const CodesScreen: FC<CodesScreenProps> = observer(function CodesScreen() {
  // Pull in one of our MST stores
  const { scanStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  return (
    <Screen
      safeAreaEdges={["top", "bottom"]}
      style={$root}
      preset="scroll"
      contentContainerStyle={$container}
    >
      <View>
        <Text text={`${scanStore.scans.length} codes scanned`} />

        {scanStore.scans.map((scan, index) => (
          <Text key={`scan-index-${index}`} text={scan} />
        ))}
      </View>

      <Button text="Go back" onPress={() => navigation.goBack()} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
}
