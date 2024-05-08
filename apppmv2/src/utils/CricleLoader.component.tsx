import React, { useEffect, useRef } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';
import { Circle, Svg, G, Defs, Mask, Rect } from 'react-native-svg';

interface IProps {
    valueAnimation: number;
}

const CricleLoader: React.FC<IProps> = (props: IProps) => {
    const { valueAnimation } = props;
    const size = 300,
        strokeWidth = 2,
        center = size / 2,
        radius = size / 2 - strokeWidth / 2,
        cicumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);

    const animation = (toValue: any) => {
        return Animated.timing(progressAnimation, {
            toValue: toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }

    useEffect(() => {
        animation(valueAnimation);
    }, [valueAnimation])

    useEffect(() => {
        progressAnimation.addListener((value) => {
            const strokeDashoffset = cicumference - (cicumference * value.value) / 100;

            if (progressRef?.current) {
                progressRef.current.setNativeProps({
                    strokeDashoffset
                })
            }

        }, [valueAnimation]);
    })

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} >
                <G rotation="-90" origin={center}>
                    <Circle stroke={'#ccc'} cx={center} cy={center} r={radius} strokeWidth={strokeWidth} fill={'#fff'} fillOpacity={0} />
                    <Circle
                        ref={progressRef}
                        stroke={'red'}
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={cicumference}
                        fill={'#fff'}
                        fillOpacity={0}
                    // strokeDashoffset={cicumference - (cicumference * 20) / 100}
                    />
                </G>
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default React.memo(CricleLoader);