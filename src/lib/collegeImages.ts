/**
 * College-specific campus image mapping.
 * Maps college names to their respective campus images in /public/images/colleges/.
 * Falls back to a generic premium campus image for unmapped colleges.
 */

const COLLEGE_IMAGE_MAP: Record<string, string> = {
  "IIT Bombay": "/images/colleges/iit-bombay.png",
  "IIT Delhi": "/images/colleges/iit-delhi.png",
  "IIT Madras": "/images/colleges/iit-madras.png",
  "IIT Kanpur": "/images/colleges/iit-kanpur.png",
  "IIT Kharagpur": "/images/colleges/iit-kharagpur.png",
  "IIT Roorkee": "/images/colleges/iit-roorkee.png",
  "IIT Guwahati": "/images/colleges/iit-guwahati.png",
  "IIT Hyderabad": "/images/colleges/iit-hyderabad.png",
  "BITS Pilani": "/images/colleges/bits-pilani.png",
  "NIT Trichy": "/images/colleges/nit-trichy.png",
  "VIT Vellore": "/images/colleges/vit-vellore.png",
};

const DEFAULT_IMAGE = "/images/colleges/default-campus.png";

/**
 * Returns the campus image URL for a given college name.
 * First checks for an exact match, then partial matches, then returns the default.
 */
export function getCollegeImage(collegeName: string): string {
  // Exact match
  if (COLLEGE_IMAGE_MAP[collegeName]) {
    return COLLEGE_IMAGE_MAP[collegeName];
  }

  // Partial match (e.g. "Indian Institute of Technology Bombay" → "IIT Bombay")
  const lowerName = collegeName.toLowerCase();
  for (const [key, url] of Object.entries(COLLEGE_IMAGE_MAP)) {
    if (lowerName.includes(key.toLowerCase())) {
      return url;
    }
  }

  return DEFAULT_IMAGE;
}
