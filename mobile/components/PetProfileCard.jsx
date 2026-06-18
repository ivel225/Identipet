import { Text, View } from "react-native";

import { formatDate } from "../utils/formatters";
import { petProfileCardStyles as styles } from "./PetProfileCard.styles";

export default function PetProfileCard({ profile }) {
  const vaccinations = profile.vaccination_records ?? [];
  const owner = profile.owner ?? {};

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text selectable style={styles.name}>{profile.name}</Text>
        <Text selectable style={styles.species}>{profile.species}</Text>
      </View>
      <View style={styles.grid}>
        <ProfileRow label="Breed" value={profile.breed || "Not recorded"} />
        <ProfileRow label="Gender" value={profile.gender || "Not recorded"} />
        <ProfileRow label="Color" value={profile.color || "Not recorded"} />
        <ProfileRow label="Age" value={profile.age ?? "Not recorded"} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Owner Contact</Text>
        <Text selectable style={styles.primaryText}>{owner.full_name}</Text>
        <Text selectable style={styles.secondaryText}>{owner.contact_number}</Text>
        <Text selectable style={styles.secondaryText}>{owner.address}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vaccination Status</Text>
        {vaccinations.length === 0 ? (
          <Text selectable style={styles.secondaryText}>No vaccination records found.</Text>
        ) : (
          vaccinations.map((record) => (
            <View key={record.record_id} style={styles.vaccineRow}>
              <Text selectable style={styles.primaryText}>{record.vaccine_name}</Text>
              <Text selectable style={styles.secondaryText}>
                Next due: {formatDate(record.next_due_date)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

function ProfileRow({ label, value }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text selectable style={styles.rowValue}>{String(value)}</Text>
    </View>
  );
}
