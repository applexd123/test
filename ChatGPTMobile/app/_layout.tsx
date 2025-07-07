import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#202123" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#343541' },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}