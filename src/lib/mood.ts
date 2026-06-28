// ============================================================
// MOOD THEME — each energy level gives the Voyage page its own
// "ambiance": a glass tint, an accent colour, a label and a line
// so switching Doux / Normal / À fond is unmistakable.
// ============================================================
import type { Mood } from "../data/types";

export type MoodTheme = {
  label: string; // short badge label
  tint: string; // accent colour (segment, badge, callouts)
  soft: string; // translucent tint for the badge / glass wash
  wash: string; // page ambiance radial colour
  tagline: string; // one line describing the rhythm
};

export const MOOD_THEME: Record<Mood, MoodTheme> = {
  fatigue: {
    label: "Rythme doux",
    tint: "#30b0c7", // systemTeal — calme
    soft: "rgba(48,176,199,0.14)",
    wash: "rgba(48,176,199,0.20)",
    tagline: "On lève le pied — soirées calmes, repos privilégié.",
  },
  normal: {
    label: "Rythme normal",
    tint: "#0071e3", // systemBlue — équilibre
    soft: "rgba(0,113,227,0.12)",
    wash: "rgba(0,113,227,0.16)",
    tagline: "Équilibre — matin actif, après-midi tranquille, soir doux.",
  },
  energy: {
    label: "À fond",
    tint: "#ff9f0a", // systemOrange — énergie
    soft: "rgba(255,159,10,0.16)",
    wash: "rgba(255,159,10,0.22)",
    tagline: "Énergie au max — on ajoute balades, cafés et découvertes.",
  },
};
