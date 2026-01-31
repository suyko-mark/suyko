import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { questions } from "../questions";

export default function Quiz() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});

  const question = questions[currentIndex];
  const choices = Object.entries(question.choices);

  const selectAnswer = (key: string) => {
    if (question.type === "checkbox") {
      const prev = answers[question.id] || [];
      setAnswers({
        ...answers,
        [question.id]: prev.includes(key)
          ? prev.filter((k: string) => k !== key)
          : [...prev, key],
      });
    } else {
      setAnswers({ ...answers, [question.id]: key });
    }
  };

  const isSelected = (key: string) => {
    if (question.type === "checkbox") {
      return answers[question.id]?.includes(key);
    }
    return answers[question.id] === key;
  };

  const calculateScore = () => {
    let score = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;

      if (q.type === "checkbox") {
        const correct = JSON.stringify((q.answer as string[]).sort());
        const user = JSON.stringify((userAnswer as string[]).sort());
        if (correct === user) score++;
      } else {
        if (userAnswer === q.answer) score++;
      }
    });

    return score;
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const score = calculateScore();
      router.push({
        pathname: "/result",
        params: { score },
      });
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {currentIndex + 1}. {question.question}
      </Text>

      {choices.map(([key, value]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.option,
            isSelected(key) && styles.selected,
          ]}
          onPress={() => selectAnswer(key)}
        >
          <Text>{key}. {value}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.buttons}>
        <Button title="Previous" onPress={prev} disabled={currentIndex === 0} />
        <Button
          title={currentIndex === questions.length - 1 ? "Finish" : "Next"}
          onPress={next}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  question: { fontSize: 18, marginBottom: 20 },
  option: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: "#cce5ff",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
