import React, { createRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
} from 'react-native';

import TextInputComponent from '../../../components/cTextInput/TextInput.component';

interface IProps {
    value?: any;
    label?: string;
    isRefresh?: boolean;
}

const Evaluate: React.FC<IProps> = (props: IProps) => {
    const [comment, setComment] = useState<string>("");

    return (
        <View style={{ flex: 1, padding: 14, height: '100%', width: '100%' }}>
            <View style={styles.item}>
                <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 6 }}>Bình luận</Text>
                <View style={{ flex: 1 }}>
                    {/* nhập bình luận của bạn */}
                    <View style={{ flex: 1, padding: 12 }}>
                        <TextInputComponent
                            style={[{ borderWidth: 0.5, padding: 12, borderRadius: 22, fontSize: 18 },]}
                            placeholder="Nhập bình luận của bạn"
                            value={comment}
                            onComplete={(text) => {
                                setComment(text);
                            }}
                        />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 16 }}>
                        <Text>Chưa có bình luận nào!</Text>
                    </View>
                </View>
            </View>
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

export default Evaluate;
