import React, { useRef, useState, useEffect } from "react";
import { TextInput } from 'react-native';
import {
  CodeInputSection,
  HiddenTextInput,
  CodeInputsContainer,
  CodeInput,
  CodeInputText,
  CodeInputFocused,
} from "./Style.OTP";

const CodeInputField: React.FC<{setPinReady: any, code: any, setCode: any, maxLength: any}> = ({setPinReady, code, setCode, maxLength}) => {
  const codeDigitsArray = new Array(maxLength).fill(0);

  // ref cho input
  const textInputRef = useRef<TextInput>(null);
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);

  const handleOnBlur = () => {
    setInputContainerIsFocused(false);
  };

  useEffect(() => {
    setPinReady(code.length === maxLength);
    return () => setPinReady(false);
  }, [code]);

  const handleOnPress = () => {
    setInputContainerIsFocused(true);
    textInputRef?.current?.focus();
  };

  const toCodeDigitInput = (_value: any, index: any) => {
    const emptyInputChar = " ";
    const digit = code[index] || emptyInputChar;

    // formatting
    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;

    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    const StyledCodeInput =
      inputContainerIsFocused && isDigitFocused ? CodeInputFocused : CodeInput;

    return (
      <StyledCodeInput key={index}>
        <CodeInputText>{digit}</CodeInputText>
      </StyledCodeInput>
    );
  };

  return (
    <>
      <CodeInputSection>
        <CodeInputsContainer onPress={handleOnPress}>
          {codeDigitsArray.map(toCodeDigitInput)}
        </CodeInputsContainer>
        <HiddenTextInput
          ref={textInputRef}
          value={code}
          onChangeText={setCode}
          onSubmitEditing={handleOnBlur}
          keyboardType="number-pad"
          returnKeyType="done"
          textContentType="oneTimeCode"
          maxLength={maxLength}
        />
      </CodeInputSection>
    </>
  );
};

export default CodeInputField;
