import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

import { loginFormStyles as styles } from "./LoginForm.styles";

export default function LoginForm({
  credentials,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text selectable style={styles.eyebrow}>IDentiPet Field</Text>
        <Text selectable style={styles.title}>Log in</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          inputMode="email"
          keyboardType="email-address"
          onChangeText={(value) => onChange("email", value)}
          placeholder="field@example.com"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          textContentType="emailAddress"
          value={credentials.email}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="current-password"
          onChangeText={(value) => onChange("password", value)}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          style={styles.input}
          textContentType="password"
          value={credentials.password}
        />
      </View>

      {error ? (
        <Text selectable style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Pressable
        disabled={isSubmitting}
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
          isSubmitting ? styles.buttonDisabled : null,
        ]}
      >
        {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Log in</Text>}
      </Pressable>
    </View>
  );
}
