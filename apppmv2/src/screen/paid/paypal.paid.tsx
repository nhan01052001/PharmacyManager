import { useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

import StylesTheme from '../../global/theme/Styles.Theme';
import { CloseIcon } from '../../global/icon/Icon';
import { AlertService } from '../../components/cAlert/Alert.component';
import { ENUM } from '../../global/enum';
import { HeaderComponent } from '../../components/cHeadder/Header.Component';
import { AllStackParams } from '../../navigation/Stack.Navigator';
import HttpService from '../../service/HttpService.Service';
import { LoadingService } from '../../components/cLoading/Loading.component';
import { env } from '../../utils/env.utils';


const Paypal = () => {
  const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
  const [showGateway, setShowGateway] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
  const route = useRoute();
  const { params }: any = route.params;

  function onMessage(e: any) {
    let data = e.nativeEvent.data;
    setShowGateway(false);
    console.log(data);
    let payment = JSON.parse(data);
    if (payment.status === 'COMPLETED') {
      AlertService.show(ENUM.E_SUCCESS, 'Thanh toán thành công!', 3000, null);
      if (params?.deliveryAddress && params?.ids && params?.isPaid) {
        LoadingService.show();
        HttpService.Post(`${env.URL}/cart/setStatusItemsInCart`, {
          ...params
        }).then((res: any) => {
          LoadingService.hide();
          if (res && res?.status === 200) {
            AlertService.show(ENUM.E_SUCCESS, res?.message, 3000);
            navigation.navigate('BottomTabNavigator');
          } else {
            LoadingService.hide();
            AlertService.show(ENUM.E_ERROR, 'Đặt hàng thành công!', 3000, "Lỗi");
          }
        })
      }
    } else {
      LoadingService.hide();
      AlertService.show(ENUM.E_ERROR, 'Thanh toán thất bại. Vui lòng thử lại!', 3000, null);
    }
  }

  useEffect(() => {
    console.log(params, 'params');
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent
        titleHeader={'Thanh toán'}
        isOptionHome={false}
        goBack={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.btnCon}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setShowGateway(true)}>
            <Text style={styles.btnTxt}>Sử dụng thanh toán qua PayPal</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showGateway ? (
        <Modal
          visible={showGateway}
          onDismiss={() => setShowGateway(false)}
          onRequestClose={() => setShowGateway(false)}
          animationType={'fade'}
          transparent>
          <SafeAreaView style={styles.webViewCon}>
            <View style={styles.wbHead}>
              <TouchableOpacity
                style={{ padding: 13 }}
                onPress={() => setShowGateway(false)}>
                <CloseIcon size={16} color='#000' />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#00457C',
                }}>
                PayPal GateWay
              </Text>
              <View style={{ padding: 13, opacity: prog ? 1 : 0 }}>
                <ActivityIndicator size={24} color={progClr} />
              </View>
            </View>
            <WebView
              source={{ uri: 'https://pharmacy-manager-401ca.web.app/' }}
              style={{ flex: 1 }}
              onLoadStart={() => {
                setProg(true);
                setProgClr('#000');
              }}
              onLoadProgress={() => {
                setProg(true);
                setProgClr('#00457C');
              }}
              onLoadEnd={() => {
                setProg(false);
              }}
              onLoad={() => {
                setProg(false);
              }}
              onMessage={onMessage}
            />
          </SafeAreaView>
        </Modal>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  btnCon: {
    height: 45,
    width: '70%',
    elevation: 1,
    backgroundColor: '#00457C',
    borderRadius: 3,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 18,
  },
  webViewCon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    zIndex: 25,
    elevation: 2,
  },
});
export default Paypal;