import { useMemo } from "react";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

export function LabeledTextArea({
  label,
  placeholder,
  value,
  onChangeText,
}: Props) {
  const inputAccessoryViewID = useMemo(
    () => `textarea-done-${Math.random().toString(36).slice(2, 10)}`,
    []
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B6B6B"
        value={value}
        onChangeText={onChangeText}
        multiline
        inputAccessoryViewID={
          Platform.OS === "ios" ? inputAccessoryViewID : undefined
        }
        returnKeyType="done"
        blurOnSubmit
        onSubmitEditing={Keyboard.dismiss}
        textAlignVertical="top"
        style={styles.input}
      />

      {Platform.OS === "ios" ? (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.accessoryContainer}>
            <Pressable onPress={Keyboard.dismiss} hitSlop={8}>
              <Text style={styles.accessoryButtonText}>Valmis</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 14,
  },
  input: {
    backgroundColor: "#EEEEEE",
    borderColor: "#00000012",
    borderWidth: 1,
    borderRadius: 6,
    minHeight: 120,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    fontFamily: "Poppins_400",
  },
  accessoryContainer: {
    backgroundColor: "#F7F7F7",
    borderTopColor: "#00000012",
    borderTopWidth: 1,
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  accessoryButtonText: {
    color: "#111111",
    fontFamily: "Poppins_700",
    fontSize: 14,
  },
});
