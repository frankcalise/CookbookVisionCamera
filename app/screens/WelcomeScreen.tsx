import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { AppStackScreenProps } from "../navigators"
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera"
import { Alert, Linking, StyleSheet, View, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text } from "app/components"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useStores } from "app/models"
import { spacing } from "app/theme"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(_props) {
  const [cameraPermission, setCameraPermission] = React.useState<CameraPermissionStatus>()
  const [showScanner, setShowScanner] = React.useState(false)
  const [isActive, setIsActive] = React.useState(false)

  const { scanStore } = useStores()

  React.useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission)
  }, [])

  const promptForCameraPermissions = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission()
    Camera.getCameraPermissionStatus().then(setCameraPermission)

    if (permission === "denied") await Linking.openSettings()
  }, [cameraPermission])

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      setIsActive(false)

      codes.every((code) => {
        if (code.value) {
          scanStore.addScan(code.value)
        }
        return true
      })

      setShowScanner(false)
      Alert.alert("Code scanned!")
    },
  })

  const device = useCameraDevice("back")

  const { right, top } = useSafeAreaInsets()

  if (cameraPermission == null) {
    // still loading
    return null
  }

  if (showScanner && device) {
    return (
      <View style={$cameraContainer}>
        <Camera
          isActive={isActive}
          device={device}
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          photo
          video
          onInitialized={() => {
            console.log("initialized")
          }}
        />
        <View style={[$cameraButtons, { right: right + spacing.md, top: top + spacing.md }]}>
          <TouchableOpacity style={$closeCamera} onPress={() => setShowScanner(false)}>
            <Icon icon="x" size={50} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <Screen contentContainerStyle={$container}>
      <View>
        <Text>
          Camera Permission: {cameraPermission === null ? "Loading..." : cameraPermission}
        </Text>
        {cameraPermission !== "granted" && (
          <Button onPress={promptForCameraPermissions} text="Request Camera Permission" />
        )}
      </View>

      <View>
        <Button
          onPress={() => {
            setIsActive(true)
            setShowScanner(true)
          }}
          text="Scan Barcodes"
        />
      </View>

      <View>
        <Button
          onPress={() => _props.navigation.navigate("Codes")}
          text={`View Scans (${scanStore.scans.length})`}
        />
      </View>
    </Screen>
  )
})

const $container: ViewStyle = {
  flex: 1,
  padding: 20,
  justifyContent: "space-evenly",
}

const $cameraContainer: ViewStyle = {
  flex: 1,
}

const $cameraButtons: ViewStyle = {
  position: "absolute",
}

const $closeCamera: ViewStyle = {
  marginBottom: spacing.md,
  width: 100,
  height: 100,
  borderRadius: 100 / 2,
  backgroundColor: "rgba(140, 140, 140, 0.3)",
  justifyContent: "center",
  alignItems: "center",
}
