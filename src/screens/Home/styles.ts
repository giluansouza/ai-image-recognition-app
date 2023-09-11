import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  description: {
    color: "#5171a5",
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    fontSize: 14,
    flex: 1,
    textAlignVertical: "center"
  },
  content: {
    flex: 1,
  },
  bottom: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    marginTop: -42,
    paddingTop: 12
  },
  items: {
    flex: 1,
    gap: 12
  },
  image: {
    flex: 1
  },
});