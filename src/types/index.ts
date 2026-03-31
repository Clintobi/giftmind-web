import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  display_name?: string;
  subscription_status: "free" | "pro" | "expired";
  subscription_provider: "stripe" | "revenuecat" | null;
  stripe_customer_id?: string;
  subscription_expires_at: Timestamp | null;
  people_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Person {
  id: string;
  user_id: string;
  name: string;
  birthday?: Timestamp;
  relationship:
    | "Friend"
    | "Sibling"
    | "Parent"
    | "Partner"
    | "Child"
    | "Colleague"
    | "Other";
  photo_url?: string;
  notes_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Note {
  id: string;
  person_id: string;
  user_id: string;
  text: string;
  category: NoteCategory;
  status: "active" | "given";
  given_at?: Timestamp;
  gift_card_id?: string;
  occasion_id?: string;
  created_at: Timestamp;
}

export type NoteCategory =
  | "General"
  | "Product"
  | "Experience"
  | "Book"
  | "Food"
  | "Place"
  | "Other";

export interface Occasion {
  id: string;
  person_id: string;
  user_id: string;
  type: OccasionType;
  custom_name?: string;
  date: Timestamp;
  reminder_days: number;
  created_at: Timestamp;
}

export type OccasionType =
  | "Birthday"
  | "Anniversary"
  | "Christmas"
  | "Mothers Day"
  | "Fathers Day"
  | "Graduation"
  | "Custom";

export interface GiftCard {
  id: string;
  user_id: string;
  person_id: string;
  note_id: string;
  person_name: string;
  note_text: string;
  note_category: string;
  days_remembered: number;
  occasion_type?: string;
  message?: string;
  reaction?: string;
  created_at: Timestamp;
  view_count: number;
}

export interface AffiliateClick {
  id: string;
  user_id: string;
  suggestion_text: string;
  provider: "amazon" | "bookshop";
  clicked_at: Timestamp;
}

export interface AISuggestion {
  title: string;
  description: string;
  price_range: string;
  category: string;
  search_query: string;
  rationale: string;
  affiliate_url_amazon?: string;
  affiliate_url_bookshop?: string;
}

export const NOTE_CATEGORIES: NoteCategory[] = [
  "General",
  "Product",
  "Experience",
  "Book",
  "Food",
  "Place",
  "Other",
];

export const OCCASION_TYPES: OccasionType[] = [
  "Birthday",
  "Anniversary",
  "Christmas",
  "Mothers Day",
  "Fathers Day",
  "Graduation",
  "Custom",
];

export const RELATIONSHIP_TYPES: Person["relationship"][] = [
  "Partner",
  "Parent",
  "Child",
  "Sibling",
  "Friend",
  "Colleague",
  "Other",
];

export const FREE_TIER_PERSON_LIMIT = 10;
