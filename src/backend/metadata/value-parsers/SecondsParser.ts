import { ValueParser } from "./ValueParser";

export class SecondsParser extends ValueParser {
  parse(value: string): string {
    const milliseconds = parseInt(value) * 1000;
    return milliseconds.toString();
  }
}
