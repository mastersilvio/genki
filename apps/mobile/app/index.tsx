import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const cards = [
  { label: "Passos", value: "8.421", icon: "footsteps-outline" },
  { label: "Sono", value: "7h 42", icon: "moon-outline" },
  { label: "Peso", value: "78,4 kg", icon: "scale-outline" },
] as const;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>元</Text>
          </View>
          <Text style={styles.brandText}>Genki</Text>
        </View>

        <Text style={styles.eyebrow}>QUINTA-FEIRA, 25 DE JUNHO</Text>
        <Text style={styles.title}>Bom dia, Sílvio.</Text>
        <Text style={styles.subtitle}>
          Sua saúde, preservada como uma linha do tempo contínua.
        </Text>

        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.label} style={styles.card}>
              <Ionicons
                name={card.icon}
                size={22}
                color="#17634f"
                accessibilityElementsHidden
              />
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.timeline}>
          <Text style={styles.timelineLabel}>LINHA DO TEMPO</Text>
          <Text style={styles.timelineTitle}>Toda origem importa.</Text>
          <Text style={styles.timelineCopy}>
            Mi Band → Galaxy Watch → Apple Watch → Garmin
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/sources")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Ver fontes de dados</Text>
          <Ionicons name="arrow-forward" size={18} color="#082c26" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f5ef" },
  container: { padding: 24, paddingBottom: 48 },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#b8ee74",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#082c26", fontWeight: "900", fontSize: 19 },
  brandText: { color: "#17342f", fontSize: 20, fontWeight: "700" },
  eyebrow: {
    color: "#5f7c74",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  title: { color: "#17342f", fontSize: 32, fontWeight: "700", marginTop: 8 },
  subtitle: { color: "#688078", fontSize: 16, lineHeight: 23, marginTop: 10 },
  grid: { flexDirection: "row", gap: 10, marginTop: 30 },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    minHeight: 132,
  },
  cardLabel: { color: "#718780", fontSize: 12, marginTop: 18 },
  cardValue: {
    color: "#17342f",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  timeline: {
    backgroundColor: "#103e35",
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
  },
  timelineLabel: {
    color: "#a7c9bf",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  timelineTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  timelineCopy: { color: "#b8ee74", fontSize: 13, marginTop: 22 },
  button: {
    backgroundColor: "#b8ee74",
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: { color: "#082c26", fontSize: 15, fontWeight: "700" },
});
