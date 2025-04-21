import { StyleSheet } from "react-native";

export const foodIntakeFormStyles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
    zIndex: 1000,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  inputField: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    marginTop: 5,
  },

  dropdownContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdown: {
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    borderColor: "#ccc",
  },
});
