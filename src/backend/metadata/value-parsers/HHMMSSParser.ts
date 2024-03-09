import { ValueParser } from "./ValueParser";

export class HHMMSSParser extends ValueParser {
  parse(value: string): string {
    const parts = value.split(":");
    const hoursString = parts[0];
    const minutesString = parts[1];
    const secondsString = parts[2];

    const hours = parseInt(hoursString);
    const minutes = parseInt(minutesString);
    const seconds = parseInt(secondsString);

    const milliseconds =
      hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    return milliseconds.toString();
  }
}
