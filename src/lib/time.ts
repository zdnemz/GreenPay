export type FormattedDuration = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /**
   * Human readable string
   * e.g. "1 hari 02:03:04" atau "02:03:04" depending on options
   */
  formatted: string;
};

/**
 * Options:
 * - padHours: jika true, jam akan selalu punya 2 digit ketika tampil (mis. 02)
 * - alwaysShowDays: jika false dan days === 0, bagian hari dihilangkan
 * - shortLabels: gunakan label singkat (h, m, s) atau panjang (hari)
 */
export function formatSeconds(
  totalSeconds: number,
  options?: {
    padHours?: boolean;
    alwaysShowDays?: boolean;
    shortLabels?: boolean;
  },
): FormattedDuration {
  const {
    padHours = true,
    alwaysShowDays = false,
    shortLabels = false,
  } = options ?? {};

  // Pastikan integer dan tidak negatif
  let secs = Math.max(0, Math.floor(totalSeconds));

  const days = Math.floor(secs / 86400);
  secs -= days * 86400;

  const hours = Math.floor(secs / 3600);
  secs -= hours * 3600;

  const minutes = Math.floor(secs / 60);
  const seconds = secs - minutes * 60;

  // helper pad
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");

  // Build formatted string
  const hourStr = padHours ? pad(hours) : String(hours);
  const minuteStr = pad(minutes);
  const secondStr = pad(seconds);

  let formatted = `${hourStr}:${minuteStr}:${secondStr}`;

  if (days > 0 || alwaysShowDays) {
    const dayLabel = shortLabels ? "d" : days === 1 ? "hari" : "hari";
    formatted = `${days} ${dayLabel} ${formatted}`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted,
  };
}
