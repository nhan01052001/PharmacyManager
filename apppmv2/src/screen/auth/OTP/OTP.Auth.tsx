import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
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
// import * as firebase from 'react-native-firebase';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { HeaderComponent } from '../../../components/cHeadder/Header.Component';

import { Account } from "../../../type/User.Type";
import StylesTheme from "../../../global/theme/Styles.Theme";
import { MainStackParams } from '../../../navigation/Stack.Navigator';
import { AlertService } from '../../../components/cAlert/Alert.component';
import { LoadingService } from '../../../components/cLoading/Loading.component';

const { width } = Dimensions.get("window");

export const OTP: React.FC<{ route: any }> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
  const [code, setCode] = useState<string>("");
  const [confirm, setConfirm] = useState<any>();
  const [verificationId, setVerificationId] = useState<any>(null);
  const [pinReady, setPinReady] = useState<any>(false);
  const { username, password } = route.params;
  const [numberPhone, setNumberPhone] = useState<any>("");
  const recaptchaVerifier = useRef<any>(null);
  const [timerCount, setTimerCount] = useState<number>(0);
  const [isTimeCount, setIsTimeCount] = useState<boolean>(false);

  function countDown() {
    let interval = setInterval(() => {
      setTimerCount((lastTimerCount: number) => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }

  useEffect(() => {
    if (timerCount === 0) {
      setIsTimeCount(false);
    }
  }, [timerCount])

  const MAX_CODE_LENGTH = 6;

  const sendCode = async () => {
    navigation.navigate("RegisterInformationPersonal", {
      username: username,
      password: password
    });
    // LoadingService.show();
    // await auth().signInWithPhoneNumber(`+84${username.substring(1)}`, true).then((res) => {
    //   console.log(res, 'res');
    //   LoadingService.hide();
    //   if (res) {
    //     setConfirm(res);
    //     setTimerCount(90);
    //     setIsTimeCount(true);
    //     countDown();
    //   } else {
    //     AlertService.show("", "Có lỗi trong quá trình xử lý!", 4000, "Lỗi xử lý");
    //   }
    // }).catch((error) => {
    //   console.log(error, 'error');
    // });
  };

  const confirmCode = () => {
    if (code && code.length === 6 && timerCount > 0) {
      if (confirm) {
        LoadingService.show();
        confirm?.confirm(code)
          .then((res: any) => {
            LoadingService.hide();
            console.log(res, 'res');
            if (res?.user?._user?.uid) {
              navigation.navigate("RegisterInformationPersonal", {
                username: username,
                password: password
              });
            } else {
              AlertService.show("", "OTP không chính xác", 4000);
            }
          })
          .catch((error: Error) => {
            console.log(error.message);
            LoadingService.hide();
            AlertService.show("", error.message, 4000);
          })
      }
    } else {
      AlertService.show("", "OTP không chính xác", 4000);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent
        titleHeader={'Xác nhận OTP'}
        isOptionHome={false}
        goBack={() => navigation.goBack()}
      />
      <View style={[styles.container, StylesTheme.droidSafeArea]}>
        <View
          style={{
            marginTop: 70,
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
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
              {isTimeCount && `OTP được gửi qua số điện thoại của bạn`}
            </Text>
          </View>
        </View>

        <View
          style={[StylesTheme.flexCenter, {
            flexGrow: 0.5,
          }]}
        >
          <CodeInputField
            setPinReady={setPinReady}
            code={code}
            setCode={setCode}
            maxLength={MAX_CODE_LENGTH}
          />
          {isTimeCount === true ? (
            <Text style={{ fontSize: 16 }}>
              OTP tồn tại trong: {timerCount} giây
            </Text>
          ) : (
            <Text style={{ fontSize: 16 }}></Text>
          )}
        </View>
        <View style={styles.wrapBtn}>
          {timerCount === 0 || isTimeCount === false ? (
            <TouchableOpacity style={styles.btnVerify}
              onPress={sendCode}
            >
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
        </View>
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
