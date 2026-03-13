import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (nextValues: string[]) => void;
  placeholder?: string;
};

export function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Vali variandid",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedText = useMemo(() => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    return selectedValues.join(", ");
  }, [placeholder, selectedValues]);

  const toggleOption = (value: string) => {
    const alreadySelected = selectedValues.includes(value);
    const nextValues = alreadySelected
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    onChange(nextValues);
  };

  return (
    <View style={styles.container}>

      <Pressable onPress={() => setIsOpen((prev) => !prev)} style={styles.trigger}>
        <Text style={[styles.triggerText, selectedValues.length === 0 ? styles.placeholder : null]}>
          {selectedText}
        </Text>
        <Text style={styles.arrow}>{isOpen ? "^" : "v"}</Text>
      </Pressable>

      {isOpen ? (
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <Pressable key={option} onPress={() => toggleOption(option)} style={styles.optionRow}>
                <Text style={styles.optionText}>{option}</Text>
                <Text style={styles.optionCheck}>{isSelected ? "x" : " "}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 12,
  },
  trigger: {
    backgroundColor: "#EEEEEE",
    borderColor: "#00000012",
    borderWidth: 1,
    borderRadius: 6,
    minHeight: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  triggerText: {
    fontSize: 16,
    color: "#000000",
    flex: 1,
    paddingRight: 8,
  },
  placeholder: {
    color: "#6B6B6B",
  },
  arrow: {
    fontSize: 16,
    color: "#303030",
    width: 16,
    textAlign: "right",
  },
  optionsContainer: {
    marginTop: 6,
    backgroundColor: "#ffffff",
    borderColor: "#00000012",
    borderWidth: 1,
    borderRadius: 6,
    overflow: "hidden",
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#000000",
  },
  optionCheck: {
    fontSize: 16,
    color: "#000000",
    width: 16,
    textAlign: "center",
  },
});