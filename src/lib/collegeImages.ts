/**
 * College-specific campus image mapping.
 * Maps college names to their respective campus images in /public/images/colleges/.
 * Falls back to a generic premium campus image for unmapped colleges.
 */

const COLLEGE_IMAGE_MAP: Record<string, string> = {
  // IITs
  "IIT Bombay": "/images/colleges/iit-bombay.png",
  "IIT Delhi": "/images/colleges/iit-delhi.png",
  "IIT Madras": "/images/colleges/iit-madras.png",
  "IIT Kanpur": "/images/colleges/iit-kanpur.png",
  "IIT Kharagpur": "/images/colleges/iit-kharagpur.png",
  "IIT Roorkee": "/images/colleges/iit-roorkee.png",
  "IIT Guwahati": "/images/colleges/iit-guwahati.png",
  "IIT Hyderabad": "/images/colleges/iit-hyderabad.png",
  // Private Engineering
  "BITS Pilani": "/images/colleges/bits-pilani.png",
  "NIT Trichy": "/images/colleges/nit-trichy.png",
  "VIT Vellore": "/images/colleges/vit-vellore.png",
  // Medical
  "AIIMS Delhi": "/images/colleges/aiims-delhi.png",
  "AIIMS Bhopal": "/images/colleges/aiims-delhi.png",
  "AIIMS Jodhpur": "/images/colleges/aiims-delhi.png",
  "JIPMER": "/images/colleges/medical-campus.png",
  "CMC Vellore": "/images/colleges/medical-campus.png",
  "AFMC Pune": "/images/colleges/medical-campus.png",
  "Maulana Azad Medical": "/images/colleges/medical-campus.png",
  "KMC Manipal": "/images/colleges/medical-campus.png",
  // Management
  "IIM Ahmedabad": "/images/colleges/iim-ahmedabad.png",
  "IIM Bangalore": "/images/colleges/iim-bangalore.png",
  "IIM Calcutta": "/images/colleges/iim-ahmedabad.png",
  "IIM Lucknow": "/images/colleges/iim-bangalore.png",
  "IIM Indore": "/images/colleges/iim-ahmedabad.png",
  "IIM Kozhikode": "/images/colleges/iim-bangalore.png",
  "XLRI": "/images/colleges/iim-ahmedabad.png",
  "FMS Delhi": "/images/colleges/iim-bangalore.png",
  "SPJIMR": "/images/colleges/iim-ahmedabad.png",
  "MDI Gurgaon": "/images/colleges/iim-bangalore.png",
  // Degree
  "St. Stephen's": "/images/colleges/st-stephens.png",
  "Hindu College": "/images/colleges/du-campus.png",
  "Miranda House": "/images/colleges/du-campus.png",
  "Loyola College": "/images/colleges/st-stephens.png",
  "St. Xavier's": "/images/colleges/st-stephens.png",
  "Christ University": "/images/colleges/du-campus.png",
  "Presidency University": "/images/colleges/du-campus.png",
  "Fergusson College": "/images/colleges/st-stephens.png",
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

  // Partial match (e.g. "JIPMER Puducherry" → "JIPMER")
  const lowerName = collegeName.toLowerCase();
  for (const [key, url] of Object.entries(COLLEGE_IMAGE_MAP)) {
    if (lowerName.includes(key.toLowerCase())) {
      return url;
    }
  }

  return DEFAULT_IMAGE;
}
