import fs from "fs";
import { Metadata, MetadataSchema, extractMetadataFromJSON } from "./extract";

const jsonString = fs.readFileSync("metadata.9.json", "utf8");

const json = JSON.parse(jsonString);

const schema: MetadataSchema = {
  fields: [
    {
      key: "Data.metadata.buildPatch",
      type: "string",
      description: "Game version",
      label: "Game version",
    },
    {
      key: "Data.metadata.playTime",
      type: "float_seconds",
      description: "Play time",
      label: "Play Time",
    },
    {
      key: "Data.metadata.playthroughTime",
      type: "float_seconds",
      description: "Playthrough time",
      label: "Playthrough Time",
    },
    {
      key: "Data.metadata.level",
      type: "float",
      description: "Player level",
      label: "Player Level",
    },
    {
      key: "Data.metadata.lifePath",
      type: "string",
      description: "Selected life path",
      label: "Life Path",
    },
    {
      key: "Data.metadata.bodyGender",
      type: "string",
      description: "Body gender",
      label: "Body Gender",
    },
    {
      key: "Data.metadata.brainGender",
      type: "string",
      description: "Brain gender",
      label: "Brain Gender",
    },
    {
      key: "Data.metadata.streetCred",
      type: "float",
      description: "Street cred",
      label: "Street Cred",
    },
    {
      key: "Data.metadata.gunslinger",
      type: "float",
      description: "Gunslinger skill level",
      label: "Gunslinger",
    },
    {
      key: "Data.metadata.assault",
      type: "float",
      description: "Assault skill level",
      label: "Assault",
    },
    {
      key: "Data.metadata.demolition",
      type: "float",
      description: "Demolition skill level",
      label: "Demolition",
    },
    {
      key: "Data.metadata.athletics",
      type: "float",
      description: "Athletics skill level",
      label: "Athletics",
    },
    {
      key: "Data.metadata.brawling",
      type: "float",
      description: "Brawling skill level",
      label: "Brawling",
    },
    {
      key: "Data.metadata.coldBlood",
      type: "float",
      description: "Cold blood skill level",
      label: "Cold Blood",
    },
    {
      key: "Data.metadata.stealth",
      type: "float",
      description: "Stealth skill level",
      label: "Stealth",
    },
    {
      key: "Data.metadata.engineering",
      type: "float",
      description: "Engineering skill level",
      label: "Engineering",
    },
    {
      key: "Data.metadata.crafting",
      type: "float",
      description: "Crafting skill level",
      label: "Crafting",
    },
    {
      key: "Data.metadata.hacking",
      type: "float",
      description: "Hacking skill level",
      label: "Hacking",
    },
    {
      key: "Data.metadata.combatHacking",
      type: "float",
      description: "Combat hacking skill level",
      label: "Combat Hacking",
    },
    {
      key: "Data.metadata.strength",
      type: "float",
      description: "Strength skill level",
      label: "Strength",
    },
    {
      key: "Data.metadata.intelligence",
      type: "float",
      description: "Intelligence skill level",
      label: "Intelligence",
    },
    {
      key: "Data.metadata.reflexes",
      type: "float",
      description: "Reflexes skill level",
      label: "Reflexes",
    },
    {
      key: "Data.metadata.technicalAbility",
      type: "float",
      description: "Technical ability skill level",
      label: "Technical Ability",
    },
    {
      key: "Data.metadata.cool",
      type: "float",
      description: "Cool skill level",
      label: "Cool",
    },
  ],
};

const metadata = extractMetadataFromJSON(json, schema);

function formatTime(value: number, type: "seconds") {
  if (type === "seconds") {
    if (value < 60) {
      return `${value} seconds`;
    }
    const minutes = Math.floor(value / 60);

    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours} hours`;
  }

  return `${value}`;
}

function renderMetadata(metadata: Metadata) {
  const strings: string[] = [];
  if (metadata === null) return strings;

  for (const field of metadata.fields) {
    strings.push(`${field.label}: ${field.description}`);
    if (field.type === "float_seconds" && typeof field.value === "number") {
      strings.push(`${field.type}: ${formatTime(field.value, "seconds")}`);
    } else {
      strings.push(`${field.type}: ${field.value}`);
    }
    strings.push("------------------------------------------------");
  }

  return strings;
}

const strings = renderMetadata(metadata);

for (const s of strings) {
  console.log(s);
}
