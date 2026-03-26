import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  // Navigation tabs
  "house.fill":                           "home",
  "heart.text.square.fill":              "favorite",
  "doc.text.fill":                        "description",
  "brain.head.profile":                   "psychology",
  "person.fill":                          "person",
  // Checklist / forms
  "checklist":                            "checklist",
  "checkmark.circle.fill":               "check-circle",
  "xmark.circle.fill":                   "cancel",
  // Reports
  "exclamationmark.triangle.fill":        "warning",
  "flag.fill":                            "flag",
  // Actions
  "plus.circle.fill":                     "add-circle",
  "pencil":                               "edit",
  "trash.fill":                           "delete",
  "arrow.right.circle.fill":             "arrow-forward",
  "arrow.left":                           "arrow-back",
  "chevron.right":                        "chevron-right",
  "chevron.left.forwardslash.chevron.right": "code",
  // Status
  "clock.fill":                           "access-time",
  "bell.fill":                            "notifications",
  "gear":                                 "settings",
  // Misc
  "paperplane.fill":                      "send",
  "chart.bar.fill":                       "bar-chart",
  "shield.fill":                          "security",
  "lock.fill":                            "lock",
  "eye.fill":                             "visibility",
  "calendar":                             "calendar-today",
  "photo.fill":                           "photo",
  "doc.fill":                             "insert-drive-file",
  "star.fill":                            "star",
  "gift.fill":                            "card-giftcard",
  "ticket.fill":                          "local-activity",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
