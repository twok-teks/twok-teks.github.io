import type { About } from "./types";

// Sources: owner-supplied nickname story and personal notes.
export const about: About = {
  intro:
    "I’m Khanh Van—twok-teks online. I like ambitious games, long swims, new places, and turning complicated ideas into things people can use.",
  story: [
    "“twok” comes from The Wrath of Khan. My seventh-grade art teacher suggested it, I thought it sounded cool, and it stayed. “teks” is my nod to technology.",
    "The handle fits how I work: curious, a little playful, and always building. Away from code, I reset in the water, travel with family, get outdoors, or disappear into a great story-driven game.",
  ],
  currently: [
    { label: "Playing", value: "Pragmata—pretty good so far" },
    { label: "Replaying", value: "Red Dead Redemption 2 energy" },
    { label: "Waiting", value: "Patiently-ish for GTA 6" },
  ],
  interests: [
    {
      title: "Swimming",
      description:
        "My favorite reset: steady laps, a clear head, and no notifications.",
    },
    {
      title: "Travel",
      description: "I like exploring new places around the U.S. with family.",
    },
    {
      title: "Outdoors",
      description:
        "Hiking and camping are a good counterweight to screen time.",
    },
    {
      title: "Organizing",
      description: "Cleaning and putting things in order is oddly satisfying.",
    },
  ],
  games: [
    {
      title: "Red Dead Redemption 2",
      comment:
        "My favorite game of all time. The world, pacing, and detail are hard to beat.",
      aspect: "All-time favorite",
    },
    {
      title: "Black Myth: Wukong",
      comment:
        "Mythology, spectacle, and boss fights that demand full attention.",
      aspect: "Combat & world",
    },
    {
      title: "Clair Obscur: Expedition 33",
      comment:
        "A beautiful, strange world with a combat system that keeps me engaged.",
      aspect: "Style & story",
    },
    {
      title: "Pragmata",
      comment: "Just played it, and yes—it’s pretty good.",
      aspect: "Latest play",
    },
    {
      title: "Grand Theft Auto VI",
      comment: "Currently practicing patience.",
      aspect: "Most anticipated",
    },
  ],
  pets: [],
};
