import React, { createRef } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import ItemDescribe from './ItemDescribe';

const Describe: React.FC = () => {
    const text =
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been ' +
        "the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley " +
        'of type and scrambled it to make a type specimen book. It has survived not only five centuries, ' +
        'but also the leap into electronic typesetting, remaining essentially unchanged. It was ' +
        'popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, ' +
        'and more recently with desktop publishing software like Aldus PageMaker including versions of ' +
        'Lorem Ipsum.';

    const text2 =
        'Chỉ định thuốc là chỉ những công dụng, chức năng của thuốc trong việc chữa bệnh.' +
        'Cách dùng chỉ những phương thức, cách thức sử dụng loại thuốc đó.' +
        'Liều dùng: chỉ mức sử dụng, số lần sử dụng loại thuốc đó trên một đơn vị thời gian.';

    const text3 =
        'Liều lượng của thuốc hạ sốt được tính toán dựa trên trọng lượng cơ thể, từ 10-15mg/kg, cách 4-6 giờ/lần.' +
        'Theo cách uống thuốc hạ sốt được hướng dẫn thì người dùng không nên uống thuốc hạ sốt paracetamol quá 5 lần và không quá 75mg/kg trong vòng 24 giờ.' +
        'Thuốc hạ sốt có thể sử dụng vào bất kỳ thời điểm nào trong ngày.';

    return (
        <View style={{ flex: 1, padding: 14, height: '100%', width: '100%' }}>
            <View style={styles.item}>
                <ItemDescribe label={'Thành phần'} value={text} />
            </View>
            <View style={styles.item}>
                <ItemDescribe label={'Chỉ định'} value={text2} />
            </View>
            <View style={styles.item}>
                <ItemDescribe label={'Hướng dẫn sử dụng'} value={text3} />
            </View>
            <View style={{ marginBottom: 24 }}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    item: {
        flex: 1,
        marginVertical: 12,
    },
});

export default Describe;
