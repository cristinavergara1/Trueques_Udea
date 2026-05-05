type AnyUser = Record<string, any> | null | undefined;

function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function initialsFromText(text: string): string {
  const cleaned = stripDiacritics(String(text))
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9 ._\-@]/g, "");

  if (!cleaned) return "??";

  // If it's an email, take the local part.
  const emailLike = cleaned.includes("@") ? cleaned.split("@")[0] : cleaned;

  // Split by space or separators often used in usernames.
  const parts = emailLike
    .split(/[\s._\-]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return "??";

  const first = parts[0];
  const last = parts.length > 1 ? parts[parts.length - 1] : "";

  const firstInitial = first.charAt(0);
  const secondInitial = (last ? last.charAt(0) : first.charAt(1)) || "";

  return (firstInitial + secondInitial).toUpperCase();
}

export function getUserInitials(user: AnyUser): string {
  const u = user ?? undefined;

  const fullName = [u?.nombre, u?.apellido]
    .filter((v) => typeof v === "string" && v.trim().length > 0)
    .join(" ")
    .trim();

  const fallbackText =
    fullName ||
    u?.name ||
    u?.fullName ||
    u?.correo ||
    u?.email ||
    u?.username ||
    "";

  return initialsFromText(fallbackText);
}
