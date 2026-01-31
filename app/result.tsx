import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { questions } from "../questions";

let highestScore = 0;

export default function Result() {
  const { score } = useLocalSearchParams();
  const router = useRouter();

  const numericScore = Number(score);
  if (numericScore > highestScore) {
    highestScore = numericScore;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Your Score: {numericScore} / {questions.length}
      </Text>
      <Text style={styles.text}>
        Highest Score: {highestScore}
      </Text>

      <Button title="Play Again" onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, marginBottom: 12 },
});
