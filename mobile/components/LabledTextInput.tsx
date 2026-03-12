import type { ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type TextInputProps = ComponentProps<typeof TextInput>;

type Props = {
  label: string;
  containerGap?: number;
} & Pick<
  TextInputProps,
  | "placeholder"
  | "placeholderTextColor"
  | "secureTextEntry"
  | "keyboardType"
  | "autoCapitalize"
  | "autoCorrect"
  | "textContentType"
  | "value"
  | "onChangeText"
>;

export function LabeledTextInput({
  label,
  containerGap = 9,
  placeholder,
  placeholderTextColor = "#C5C5C5",
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  textContentType,
  value,
  onChangeText,
}: Props) {
  return (
    <View style={[styles.container, { gap: containerGap }]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        textContentType={textContentType}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 9,
  },
  label: {
    color: "#4F63AC",
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: "#8D9BB5",
    borderRadius: 14,
    paddingHorizontal: 17,
    paddingVertical: 21,
    fontSize: 14,
    fontFamily: "Montserrat",
    fontWeight: "500",
  },
});