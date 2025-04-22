import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform, Alert, ToastAndroid } from "react-native";
import * as DocumentPicker from "expo-document-picker";

interface Word {
  word: string;
  definition: string;
  tags: string[];
  id: number;
}

interface WordsContextType {
  words: Word[];
  setWords: React.Dispatch<React.SetStateAction<Word[]>>;
  displayedWords: Word[];
  setDisplayedWords: React.Dispatch<React.SetStateAction<Word[]>>;
  addWord: (word: string, definition: string, tags: string[]) => void;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isSystem: boolean;
  setIsSystem: React.Dispatch<React.SetStateAction<boolean>>;
  exportWords: () => void;
  importWords: () => void;
  notificationPermission: boolean;
  setNotificationPermission: React.Dispatch<React.SetStateAction<boolean>>;
}
const WordsContext = createContext<WordsContextType | undefined>(undefined);

export function WordsProvider({ children }: { children: React.ReactNode }) {
  const [words, setWords] = useState<Word[]>([]);
  const [displayedWords, setDisplayedWords] = useState<Word[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystem, setIsSystem] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    async function loadSavedWords() {
      const storedWords = await AsyncStorage.getItem("words");
      if (storedWords) {
        setWords(JSON.parse(storedWords));
        setDisplayedWords(JSON.parse(storedWords));
      }
    }
    loadSavedWords();
  }, []);
  //   useEffect(() => {
  //     const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  //     const applyTheme = async () => {
  //       const storedTheme = await AsyncStorage.getItem("theme");

  //       if (storedTheme === "dark") {
  //         document.documentElement.classList.add("dark");
  //         setIsDarkMode(true);
  //         setIsSystem(false);
  //       } else if (storedTheme === "light") {
  //         document.documentElement.classList.remove("dark");
  //         setIsDarkMode(false);
  //         setIsSystem(false);
  //       } else {
  //         const isSystemDark = systemPrefersDark.matches;
  //         document.documentElement.classList.toggle("dark", isSystemDark);
  //         setIsDarkMode(isSystemDark);
  //         setIsSystem(true);
  //       }
  //     };
  //     applyTheme();
  //     const systemThemeChangeHandler = (e: MediaQueryListEvent) => {
  //       if (isSystem) {
  //         document.documentElement.classList.toggle("dark", e.matches);
  //         setIsDarkMode(e.matches);
  //       }
  //     };

  //     systemPrefersDark.addEventListener("change", systemThemeChangeHandler);

  //     return () => {
  //       systemPrefersDark.removeEventListener("change", systemThemeChangeHandler);
  //     };
  //   }, [isSystem]);
  const addWord = (
    newWord: string,
    newDefinition: string,
    newTags: string[]
  ) => {
    if (newWord && newDefinition) {
      const updatedWords = [
        ...words,
        {
          word: newWord,
          definition: newDefinition,
          tags: newTags || [],
          id: Math.random(),
        },
      ];
      setWords(updatedWords);
      setDisplayedWords(updatedWords);
      AsyncStorage.setItem("words", JSON.stringify(updatedWords));

      toast.success("Another word enters the Hall of Knowledge! 🏛️");
    }
  };
  const exportWords = async () => {
    try {
      const filteredWords = words.map(({ id, ...rest }) => rest);
      const json = JSON.stringify(filteredWords, null, 2);
      const fileUri = FileSystem.documentDirectory + "words.json";
      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
      if (Platform.OS === "android") {
        ToastAndroid.show("Exported successfully! 📁", ToastAndroid.SHORT);
      } else {
        Alert.alert(
          "Exported!",
          "Your words have been exported successfully 📁"
        );
      }
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert("Error", "Failed to export words.");
    }
  };
  const importWords = async () => {
    try {
      // Pick file
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      // Access the file info from result.assets[0]
      const file = result.assets[0];

      const fileContent = await FileSystem.readAsStringAsync(file.uri);

      let importedWords;
      try {
        importedWords = JSON.parse(fileContent);
      } catch {
        Alert.alert("Error", "Invalid JSON format! ❌");
        return;
      }

      const updatedWords = [...words];

      importedWords.forEach((importedWord: Word) => {
        const { word, definition, tags = [] } = importedWord;
        const existingIndex = updatedWords.findIndex((w) => w.word === word);

        if (existingIndex !== -1) {
          const existingWord = updatedWords[existingIndex];
          const mergedTags = Array.from(
            new Set([...existingWord.tags, ...tags])
          );
          updatedWords[existingIndex] = { ...existingWord, tags: mergedTags };
        } else {
          updatedWords.push({
            word,
            definition,
            tags,
            id: Math.random(), // Generate new ID
          });
        }
      });

      setWords(updatedWords);
      setDisplayedWords(updatedWords);
      await AsyncStorage.setItem("words", JSON.stringify(updatedWords));

      Platform.OS === "android"
        ? ToastAndroid.show("Imported successfully! 📥", ToastAndroid.SHORT)
        : Alert.alert("Success", "Words imported! 📥");
    } catch (error) {
      console.error("Import failed:", error);
      Alert.alert("Error", "Failed to import words.");
    }
  };
  return (
    <WordsContext.Provider
      value={{
        words,
        setWords,
        displayedWords,
        setDisplayedWords,
        addWord,
        isDarkMode,
        setIsDarkMode,
        isSystem,
        setIsSystem,
        exportWords,
        importWords,
        notificationPermission,
        setNotificationPermission,
      }}
    >
      {children}
    </WordsContext.Provider>
  );
}
export function useWords() {
  const context = useContext(WordsContext);
  if (!context) {
    throw new Error("useWords must be used within a WordsProvider");
  }
  return context;
}
