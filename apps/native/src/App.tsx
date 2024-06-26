import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Toast, Provider } from "@repo/ui";

// Import your global CSS file
import "./global.css";

export default function App() {
  return (
    <Provider>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
        <TouchableOpacity
          onPress={() => {
            Toast.showToast({
              title: "rodad1",
            });
          }}
        >
          <Text>showToast</Text>
        </TouchableOpacity>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
