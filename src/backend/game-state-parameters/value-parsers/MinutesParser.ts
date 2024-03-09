import { ValueParser } from "./ValueParser";

export class MinutesParser extends ValueParser {
  parse(value: string): string {
    const milliseconds = parseInt(value) * 60 * 1000;
    return milliseconds.toString();
  }
}
