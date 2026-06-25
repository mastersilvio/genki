import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function SourcesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Fontes" }} />
      <Text style={styles.title}>Fontes de dados</Text>
      <Text style={styles.copy}>
        A Fundação utiliza somente dados sintéticos. Integrações reais serão
        adicionadas a partir da Fase 2.
      </Text>
      <View style={styles.source}>
        <Text style={styles.sourceName}>Mock Provider</Text>
        <Text style={styles.status}>Ativo</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f5ef", padding: 24 },
  title: { color: "#17342f", fontSize: 28, fontWeight: "700", marginTop: 24 },
  copy: { color: "#668078", fontSize: 16, lineHeight: 24, marginTop: 12 },
  source: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginTop: 28,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sourceName: { color: "#17342f", fontSize: 16, fontWeight: "600" },
  status: { color: "#287457", fontSize: 14, fontWeight: "600" },
});
