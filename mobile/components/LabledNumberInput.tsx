import type { ComponentProps } from "react";
import { Keyboard, Platform, StyleSheet, Text, TextInput, View } from "react-native";

type TextInputProps = ComponentProps<typeof TextInput>;

type Props = {
  label: string;
  currencySymbol?: string;
  containerGap?: number;
} & Pick<
  TextInputProps,
  | "placeholder"
  | "placeholderTextColor"
  | "value"
  | "onChangeText"
  | "autoCapitalize"
  | "autoCorrect"
>;

export function LabeledNumberInput({
  label,
  containerGap = 9,
  placeholder,
  placeholderTextColor = "#C5C5C5",
  value,
  onChangeText,
  autoCapitalize,
  autoCorrect,
}: Props) {
  return (
    <View style={[styles.container, { gap: containerGap }]}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => Keyboard.dismiss()}
          style={styles.input}
        />
      </View>
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
  inputRow: {
    height: 48,
    borderWidth: 1,
    borderColor: "#00000012",
    borderRadius: 14,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
  },
  prefix: {
    fontSize: 14,
    fontFamily: "Montserrat",
    fontWeight: "700",
    color: "#303030",
    marginRight: 8,
  },
  input: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Montserrat",
    fontWeight: "500",
  },
});