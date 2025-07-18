import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/themeContext";
import {
  AlarmClock,
  CircleQuestionMark,
  ClockArrowDown,
  ClockArrowUp,
} from "lucide-react-native";
import { TextInput } from "react-native-gesture-handler";
import { useWords } from "../context/globalContext";
import { toast } from "sonner-native";

const Notifications = () => {
  const { colorScheme } = useTheme();
  const {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    interval,
    setInterval,
  } = useWords();
  const isDarkMode = colorScheme === "dark";
  const [tempStart, setTempStart] = useState(startTime.toString());
  const [tempEnd, setTempEnd] = useState(endTime.toString());
  const [tempBreak, setTempBreak] = useState(interval.toString());
  const [showStartInfo, setShowStartInfo] = useState(false);
  const [showEndInfo, setShowEndInfo] = useState(false);
  const [showIntervalInfo, setShowIntervalInfo] = useState(false);

  const applyChanges = () => {
    setStartTime(Number(tempStart));
    setEndTime(Number(tempEnd));
    setInterval(Number(tempBreak));
    setTempStart("");
    setTempEnd("");
    setTempBreak("");
    toast.success("Settings applied.");
  };

  const handleStartInfoPress = () => {
    setShowStartInfo(true);
    setTimeout(() => setShowStartInfo(false), 3000); // hide after 3s
  };
  const handleEndInfoPress = () => {
    setShowEndInfo(true);
    setTimeout(() => setShowEndInfo(false), 3000); // hide after 3s
  };
  const handleIntervalInfoPress = () => {
    setShowIntervalInfo(true);
    setTimeout(() => setShowIntervalInfo(false), 3000); // hide after 3s
  };
  return (
    <View className="w-full h-full px-6">
      <View className="w-full items-center space-y-2">
        <View className="w-full border-none shadow-none flex-row items-center justify-between py-5 px-4 rounded-xl">
          <View className="flex-row items-center">
            <ClockArrowDown color={isDarkMode ? "white" : "black"} />
            <Text className="ml-2 text-lg font-urbanist-semibold text-black dark:text-white">
              Starting hour
            </Text>
            <TouchableOpacity
              className="mt-1 ml-2"
              onPress={handleStartInfoPress}
            >
              <CircleQuestionMark
                color={isDarkMode ? "white" : "black"}
                size={16}
              />
            </TouchableOpacity>
            {showStartInfo && (
              <View className="w-full p-4 z-50 rounded-md absolute dark:bg-slate-800 bg-slate-200">
                <Text className="text-sm font-urbanist-semibold text-black dark:text-white">
                  This is the hour when your notifications will start. Use a
                  number between 0 and 23.
                </Text>
              </View>
            )}
          </View>
          <TextInput
            placeholder={`${startTime}:00`}
            placeholderTextColor="#888"
            className="p-[10px] rounded-lg border-b border-borderColor dark:border-borderDark focus:border-primary text-black dark:text-white font-urbanist-medium text-base"
            onChangeText={setTempStart}
            keyboardType="numeric"
          />
        </View>

        <View className="w-full border-y border-borderColor dark:border-borderDark shadow-none flex-row items-center justify-between py-5 px-4 rounded-xl">
          <View className="flex-row items-center">
            <ClockArrowUp color={isDarkMode ? "white" : "black"} />
            <Text className="ml-2 text-lg font-urbanist-semibold text-black dark:text-white">
              Ending hour
            </Text>
            <TouchableOpacity
              className="mt-1 ml-2"
              onPress={handleEndInfoPress}
            >
              <CircleQuestionMark
                color={isDarkMode ? "white" : "black"}
                size={16}
              />
            </TouchableOpacity>
            {showEndInfo && (
              <View className="w-full p-4 z-50 rounded-md absolute dark:bg-slate-800 bg-slate-200">
                <Text className="text-sm font-urbanist-semibold text-black dark:text-white">
                  This is the hour when your notifications will stop. Use a
                  number greater than starting time and less than 24.
                </Text>
              </View>
            )}
          </View>
          <TextInput
            placeholder={`${endTime}:00`}
            placeholderTextColor="#888"
            className="p-[10px] rounded-lg border-b border-borderColor dark:border-borderDark focus:border-primary text-black dark:text-white font-urbanist-medium text-base"
            onChangeText={setTempEnd}
            keyboardType="numeric"
          />
        </View>

        <View className="w-full border-none shadow-none flex-row items-center justify-between py-5 px-4 rounded-xl">
          <View className="flex-row items-center">
            <AlarmClock color={isDarkMode ? "white" : "black"} />
            <Text className="ml-2 text-lg font-urbanist-semibold text-black dark:text-white">
              Time interval
            </Text>
            <TouchableOpacity
              className="mt-1 ml-2"
              onPress={handleIntervalInfoPress}
            >
              <CircleQuestionMark
                color={isDarkMode ? "white" : "black"}
                size={16}
              />
            </TouchableOpacity>
            {showIntervalInfo && (
              <View className="w-full p-4 z-50 rounded-md absolute dark:bg-slate-800 bg-slate-200">
                <Text className="text-sm font-urbanist-semibold text-black dark:text-white">
                  This is the time interval between each notification, choose
                  any time but in minutes, e.g; 1h30m = 90
                </Text>
              </View>
            )}
          </View>
          <TextInput
            placeholder={`${interval} minute(s)`}
            placeholderTextColor="#888"
            className="p-[10px] rounded-lg border-b border-borderColor dark:border-borderDark focus:border-primary text-black dark:text-white font-urbanist-medium text-base"
            keyboardType="numeric"
            onChangeText={setTempBreak}
          />
        </View>
        <TouchableOpacity
          onPress={applyChanges}
          className="py-3 w-full items-center justify-center bg-primary rounded-md"
        >
          <Text className="text-white font-urbanist-semibold">Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Notifications;
