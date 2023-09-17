import React, { useState, useRef, useEffect, useCallback } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import CodeInputField from "./CodeInputField.OTP";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { VerifyIcon } from "../../../global/icon/Icon";
// import { firebaseConfig } from "../firebase/firebaseConfig";
import { firebase as firebaseConfig } from "../../../firebase/config";
import firebase from "firebase/compat/app";

import { Account } from "../../../type/User.Type";
// import {
//   FirebaseRecaptchaVerifierModal,
//   FirebaseRecaptchaBanner,
// } from "expo-firebase-recaptcha";

const { width } = Dimensions.get("window");

export const OTP: React.FC<{navigation: any, route: any}> = ({ navigation, route }) => {
  const [code, setCode] = useState<any>("");
  const [verificationId, setVerificationId] = useState<any>(null);
  const [pinReady, setPinReady] = useState<any>(false);
  const { username, password } = route.params;
  const [numberPhone, setNumberPhone] = useState<any>("");
  const recaptchaVerifier = useRef<any>(null);
  const [status, setStatus] = useState<any>(false);
  const [timerCount, setTimer] = useState<any>();

  function countDown() {
    let interval = setInterval(() => {
      setTimer((lastTimerCount: any) => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }

  const MAX_CODE_LENGTH = 6;

  const sendCode = async () => {

    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    const verificationId = await phoneProvider.verifyPhoneNumber(
      "+84" + username,
      recaptchaVerifier.current
    );
    setVerificationId(verificationId);
  };

  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setCode("");
        // navigation.navigate("SC_Continue", {
        //   username: username,
        //   password: password,
        // });
      })
      .catch((error) => {
        Alert.alert(error + " Mã OTP không chính xác!");
      });
  };

console.log(route.params, 'route.params');


  return (
    <View style={styles.container}>
      {/* <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      /> */}
      <View
        style={{
          marginTop: 70,
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
          //   flexGrow: 3,
        }}
      >
        <Image
          style={styles.image}
          source={require("../../../global/assets/image/otp.png")}
          resizeMode="contain"
        />
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 5 }}>
            Xác thực OTP
          </Text>
          <Text style={{ fontSize: 16 }}>
            OTP được gửi qua số điện thoại của bạn {numberPhone}
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 0.5,
        }}
      >
        <CodeInputField
          setPinReady={setPinReady}
          code={code}
          setCode={setCode}
          maxLength={MAX_CODE_LENGTH}
        />
        {status === true ? (
          <Text style={{ fontSize: 16 }}>
            OTP tồn tại trong: {timerCount} giây
          </Text>
        ) : (
          <Text style={{ fontSize: 16 }}></Text>
        )}
      </View>
      <View style={styles.wrapBtn}>
        {timerCount === 0 || status === false ? (
          <TouchableOpacity style={styles.btnVerify} onPress={sendCode}>
            <VerifyIcon color="green" size={24} />
            <Text
              style={{ fontSize: 18, fontWeight: "500", textAlign: "center" }}
            >
              Gửi OTP
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnVerify} onPress={confirmCode}>
            <VerifyIcon color="green" size={24} />
            <Text
              style={{ fontSize: 18, fontWeight: "500", textAlign: "center" }}
            >
              Xác nhận
            </Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity style={styles.btnVerify} onPress={confirmCode}>
          <VerifyIcon color="green" size={24} />
          <Text
            style={{ fontSize: 18, fontWeight: "500", textAlign: "center" }}
          >
            Xác nhận
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    padding: 10,
  },

  wrapBtn: {
    flex: 1,
    // flexGrow: 2,
  },

  btnVerify: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
  },

  image: {
    maxWidth: 200,
    maxHeight: 200,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
