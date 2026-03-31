import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";

function db() {
  const firestore = getFirebaseDb();
  if (!firestore) throw new Error("Firebase not configured. Add credentials to .env.local");
  return firestore;
}
import type { Person, Note, Occasion, User, GiftCard, NoteCategory, OccasionType } from "@/types";

// ─── Users ───

export async function createUserDoc(uid: string, email: string, displayName?: string) {
  const ref = doc(db(),"users", uid);
  const existing = await getDoc(ref);
  if (existing.exists()) return;

  const { setDoc } = await import("firebase/firestore");
  await setDoc(ref, {
    uid,
    email,
    display_name: displayName || "",
    subscription_status: "free",
    subscription_provider: null,
    subscription_expires_at: null,
    people_count: 0,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  } satisfies User);
}

export function subscribeToUser(uid: string, callback: (user: User | null) => void): Unsubscribe {
  return onSnapshot(doc(db(),"users", uid), (snap) => {
    callback(snap.exists() ? ({ ...snap.data(), uid: snap.id } as User) : null);
  });
}

// ─── People ───

export async function createPerson(
  userId: string,
  data: { name: string; relationship: Person["relationship"]; birthday?: Date }
): Promise<string> {
  const ref = await addDoc(collection(db(),"persons"), {
    user_id: userId,
    name: data.name,
    relationship: data.relationship,
    birthday: data.birthday ? Timestamp.fromDate(data.birthday) : null,
    photo_url: null,
    notes_count: 0,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  });

  await updateDoc(doc(db(),"users", userId), {
    people_count: increment(1),
    updated_at: Timestamp.now(),
  });

  return ref.id;
}

export async function updatePerson(
  personId: string,
  data: Partial<{ name: string; relationship: Person["relationship"]; birthday: Date | null }>
) {
  const updates: Record<string, unknown> = { updated_at: Timestamp.now() };
  if (data.name !== undefined) updates.name = data.name;
  if (data.relationship !== undefined) updates.relationship = data.relationship;
  if (data.birthday !== undefined) {
    updates.birthday = data.birthday ? Timestamp.fromDate(data.birthday) : null;
  }
  await updateDoc(doc(db(),"persons", personId), updates);
}

export async function deletePerson(personId: string, userId: string) {
  // Delete all notes for this person
  const notesQ = query(collection(db(),"notes"), where("person_id", "==", personId));
  const notesSnap = await getDocs(notesQ);
  const deletePromises = notesSnap.docs.map((d) => deleteDoc(d.ref));

  // Delete all occasions for this person
  const occasionsQ = query(collection(db(),"occasions"), where("person_id", "==", personId));
  const occasionsSnap = await getDocs(occasionsQ);
  deletePromises.push(...occasionsSnap.docs.map((d) => deleteDoc(d.ref)));

  await Promise.all(deletePromises);
  await deleteDoc(doc(db(),"persons", personId));
  await updateDoc(doc(db(),"users", userId), {
    people_count: increment(-1),
    updated_at: Timestamp.now(),
  });
}

export function subscribeToPeople(
  userId: string,
  callback: (people: Person[]) => void
): Unsubscribe {
  const q = query(
    collection(db(),"persons"),
    where("user_id", "==", userId),
    orderBy("created_at", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Person)));
  });
}

export async function getPerson(personId: string): Promise<Person | null> {
  const snap = await getDoc(doc(db(),"persons", personId));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as Person) : null;
}

// ─── Notes ───

export async function createNote(data: {
  person_id: string;
  user_id: string;
  text: string;
  category: NoteCategory;
  occasion_id?: string;
}): Promise<string> {
  const ref = await addDoc(collection(db(),"notes"), {
    ...data,
    status: "active",
    given_at: null,
    gift_card_id: null,
    created_at: Timestamp.now(),
  });

  await updateDoc(doc(db(),"persons", data.person_id), {
    notes_count: increment(1),
    updated_at: Timestamp.now(),
  });

  return ref.id;
}

export async function markNoteAsGiven(noteId: string, giftCardId?: string) {
  await updateDoc(doc(db(),"notes", noteId), {
    status: "given",
    given_at: Timestamp.now(),
    ...(giftCardId ? { gift_card_id: giftCardId } : {}),
  });
}

export function subscribeToNotes(
  personId: string,
  callback: (notes: Note[]) => void
): Unsubscribe {
  const q = query(
    collection(db(),"notes"),
    where("person_id", "==", personId),
    orderBy("created_at", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Note)));
  });
}

// ─── Occasions ───

export async function createOccasion(data: {
  person_id: string;
  user_id: string;
  type: OccasionType;
  custom_name?: string;
  date: Date;
  reminder_days?: number;
}): Promise<string> {
  const ref = await addDoc(collection(db(),"occasions"), {
    person_id: data.person_id,
    user_id: data.user_id,
    type: data.type,
    custom_name: data.custom_name || null,
    date: Timestamp.fromDate(data.date),
    reminder_days: data.reminder_days ?? 7,
    created_at: Timestamp.now(),
  });
  return ref.id;
}

export async function deleteOccasion(occasionId: string) {
  await deleteDoc(doc(db(),"occasions", occasionId));
}

export function subscribeToOccasions(
  userId: string,
  callback: (occasions: Occasion[]) => void
): Unsubscribe {
  const q = query(
    collection(db(),"occasions"),
    where("user_id", "==", userId),
    orderBy("date", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Occasion)));
  });
}

export function subscribeToPersonOccasions(
  personId: string,
  callback: (occasions: Occasion[]) => void
): Unsubscribe {
  const q = query(
    collection(db(),"occasions"),
    where("person_id", "==", personId),
    orderBy("date", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Occasion)));
  });
}

// ─── Gift Cards ───

export async function createGiftCard(data: {
  user_id: string;
  person_id: string;
  note_id: string;
  person_name: string;
  note_text: string;
  note_category: string;
  days_remembered: number;
  occasion_type?: string;
  message?: string;
}): Promise<string> {
  const { nanoid } = await import("nanoid");
  const cardId = nanoid(12);
  const { setDoc } = await import("firebase/firestore");

  await setDoc(doc(db(),"gift_cards", cardId), {
    id: cardId,
    ...data,
    reaction: null,
    created_at: Timestamp.now(),
    view_count: 0,
  });

  return cardId;
}

export async function getGiftCard(cardId: string): Promise<GiftCard | null> {
  const snap = await getDoc(doc(db(),"gift_cards", cardId));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as GiftCard) : null;
}

export async function updateGiftCardReaction(cardId: string, reaction: string) {
  await updateDoc(doc(db(),"gift_cards", cardId), { reaction });
}

export async function incrementGiftCardViews(cardId: string) {
  await updateDoc(doc(db(),"gift_cards", cardId), { view_count: increment(1) });
}
