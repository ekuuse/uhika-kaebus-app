import { StyleSheet, Text, TextInput, View } from "react-native";

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
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B6B6B"
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
        style={styles.input}
      />
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
});
