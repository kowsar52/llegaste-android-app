import Icon from "react-native-vector-icons/Ionicons"
import React, { useEffect, useRef, useState } from "react"
import { ImageBackground, SafeAreaView, StatusBar, Text } from "react-native"
import ReactNativePinView from "react-native-pin-view"
import { getData } from "../../utils/Storage"
const Pin = () => {
  const pinView = useRef(null)
  const [showRemoveButton, setShowRemoveButton] = useState(false)
  const [enteredPin, setEnteredPin] = useState("")
  const [oldPin, setOldPin] = useState("")
  const [showCompletedButton, setShowCompletedButton] = useState(false)
  useEffect(() => {
    console.log('enteredPin',enteredPin)
    const getOldData = async () => {
        const old_pin = await getData('pin')
       if(old_pin){
        setOldPin(old_pin)
       }
    }

    getOldData()//get old pin
    if (enteredPin.length > 0) {
      setShowRemoveButton(true)
    } else {
      setShowRemoveButton(false)
    }

    if (enteredPin.length === oldPin.length) {
      setShowCompletedButton(true)
    } else {
      setShowCompletedButton(false)
    }
  }, [enteredPin])
  return (
    <>
      <StatusBar barStyle="light-content" />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              paddingTop: 24,
              paddingBottom: 48,
              color: "rgba(255,255,255,0.7)",
              fontSize: 48,
            }}>
            Unlock PIN
          </Text>
          <ReactNativePinView
            inputSize={32}
            ref={pinView}
            pinLength={oldPin.length}
            buttonSize={60}
            onValueChange={value => setEnteredPin(value)}
            buttonAreaStyle={{
              marginTop: 24,
            }}
            inputAreaStyle={{
              marginBottom: 24,
            }}
            inputViewEmptyStyle={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#FFF",
            }}
            inputViewFilledStyle={{
              backgroundColor: "#FFF",
            }}
            buttonViewStyle={{
              borderWidth: 1,
              borderColor: "#FFF",
            }}
            buttonTextStyle={{
              color: "#FFF",
            }}
            onButtonPress={key => {
              if (key === "custom_left") {
                pinView.current.clear()
              }
              if (key === "custom_right") {
                alert("Entered Pin: " + enteredPin)
              }
            }}
            customLeftButton={showRemoveButton ? <Icon name={"ios-backspace"} size={36} color={"#FFF"} /> : undefined}
            customRightButton={showCompletedButton ? <Icon name={"arrow-forward-outline"} size={36} color={"#FFF"} /> : undefined}
          />
        </SafeAreaView>
    </>
  )
}
export default Pin