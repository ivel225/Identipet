import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";

import LoginForm from "../components/LoginForm";
import StatusBanner from "../components/StatusBanner";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { requestToken } from "../services/apiClient";

const initialCredentials = {
  email: "",
  password: "",
};

export default function LoginScreen() {
  const router = useRouter();
  const isOnline = useNetworkStatus();
  const [credentials, setCredentials] = useState(initialCredentials);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateCredential(field, value) {
    setCredentials((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    setError("");
    setIsSubmitting(true);
    try {
      await requestToken(credentials);
      setCredentials(initialCredentials);
      router.replace("/");
    } catch (caught) {
      setError(caught.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, gap: 16 }}>
      <StatusBanner isOnline={isOnline} />
      <LoginForm
        credentials={credentials}
        error={error}
        isSubmitting={isSubmitting}
        onChange={updateCredential}
        onSubmit={handleSubmit}
      />
    </ScrollView>
  );
}
