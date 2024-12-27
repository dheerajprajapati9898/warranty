import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface RadioButtonProps {
    selected: boolean;
    onPress: () => void;
    label: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ selected, onPress, label }) => {
    return (
        <TouchableOpacity style= { styles.radioButtonContainer } >
        <View style={ [styles.radioButtonCircle, selected && styles.selectedCircle] } />
            < Text style = { styles.radioButtonLabel } > { label } </Text>
                </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioButtonCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    selectedCircle: {
        backgroundColor: '#000',
    },
    radioButtonLabel: {
        fontSize: 16,
    },
});

export default RadioButton;
