import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.savedCollege.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  const colleges = [
    // ── IITs (JEE Advanced + JEE Main) ──
    { name: "IIT Bombay", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", fees: 250000, rating: 4.9, placementPercentage: 98, establishedYear: 1958, type: "Government", description: "Indian Institute of Technology Bombay is a premier engineering institution known for cutting-edge research, world-class faculty, and exceptional placement records.", acceptedExams: ["JEE Advanced", "JEE Main"] },
    { name: "IIT Delhi", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 240000, rating: 4.9, placementPercentage: 97, establishedYear: 1961, type: "Government", description: "IIT Delhi is one of the most prestigious institutes in India, offering top-tier programs in engineering, science, and technology.", acceptedExams: ["JEE Advanced", "JEE Main"] },
    { name: "IIT Madras", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", fees: 230000, rating: 4.9, placementPercentage: 97, establishedYear: 1959, type: "Government", description: "IIT Madras is the top-ranked engineering institute in India by NIRF. Set in a sprawling campus with deer park, it excels in research output.", acceptedExams: ["JEE Advanced", "JEE Main"] },
    { name: "IIT Kanpur", location: "Kanpur, Uttar Pradesh", city: "Kanpur", state: "Uttar Pradesh", fees: 225000, rating: 4.8, placementPercentage: 95, establishedYear: 1959, type: "Government", description: "IIT Kanpur is renowned for its academic rigor and pioneering contributions to computer science and aerospace engineering.", acceptedExams: ["JEE Advanced", "JEE Main"] },
    { name: "IIT Kharagpur", location: "Kharagpur, West Bengal", city: "Kharagpur", state: "West Bengal", fees: 220000, rating: 4.8, placementPercentage: 94, establishedYear: 1951, type: "Government", description: "The oldest IIT in India, IIT Kharagpur boasts the largest campus among all IITs with diverse academic programs.", acceptedExams: ["JEE Advanced", "JEE Main"] },
    { name: "IIT Roorkee", location: "Roorkee, Uttarakhand", city: "Roorkee", state: "Uttarakhand", fees: 235000, rating: 4.7, placementPercentage: 93, establishedYear: 1847, type: "Government", description: "Originally established in 1847, IIT Roorkee is Asia's oldest technical institution. Known for civil engineering excellence.", acceptedExams: ["JEE Advanced", "JEE Main"] },
    { name: "IIT Guwahati", location: "Guwahati, Assam", city: "Guwahati", state: "Assam", fees: 225000, rating: 4.6, placementPercentage: 91, establishedYear: 1994, type: "Government", description: "IIT Guwahati is set on the banks of the Brahmaputra river. Known for research in nanotechnology and energy.", acceptedExams: ["JEE Advanced", "JEE Main"] },
    { name: "IIT Hyderabad", location: "Hyderabad, Telangana", city: "Hyderabad", state: "Telangana", fees: 230000, rating: 4.6, placementPercentage: 92, establishedYear: 2008, type: "Government", description: "IIT Hyderabad is among the fastest-growing IITs, known for interdisciplinary research and AI/ML programs.", acceptedExams: ["JEE Advanced", "JEE Main"] },

    // ── NITs (JEE Main) ──
    { name: "NIT Trichy", location: "Tiruchirappalli, Tamil Nadu", city: "Trichy", state: "Tamil Nadu", fees: 150000, rating: 4.7, placementPercentage: 95, establishedYear: 1964, type: "Government", description: "NIT Tiruchirappalli is the highest-ranked NIT in India with excellent placement records and vibrant campus life.", acceptedExams: ["JEE Main"] },
    { name: "NIT Warangal", location: "Warangal, Telangana", city: "Warangal", state: "Telangana", fees: 145000, rating: 4.6, placementPercentage: 91, establishedYear: 1959, type: "Government", description: "NIT Warangal is among the top NITs with strong industry connections and impressive placement statistics.", acceptedExams: ["JEE Main"] },
    { name: "NIT Surathkal", location: "Mangalore, Karnataka", city: "Mangalore", state: "Karnataka", fees: 155000, rating: 4.6, placementPercentage: 92, establishedYear: 1960, type: "Government", description: "NIT Karnataka (Surathkal) is a top-ranked NIT located near the beautiful Surathkal beach.", acceptedExams: ["JEE Main"] },
    { name: "NIT Rourkela", location: "Rourkela, Odisha", city: "Rourkela", state: "Odisha", fees: 140000, rating: 4.4, placementPercentage: 88, establishedYear: 1961, type: "Government", description: "NIT Rourkela is a top NIT known for metallurgical and mining engineering programs.", acceptedExams: ["JEE Main"] },
    { name: "NIT Calicut", location: "Kozhikode, Kerala", city: "Kozhikode", state: "Kerala", fees: 135000, rating: 4.4, placementPercentage: 87, establishedYear: 1961, type: "Government", description: "NIT Calicut is one of the premier NITs in South India, set in lush green surroundings of Kerala.", acceptedExams: ["JEE Main"] },
    { name: "NIT Jaipur", location: "Jaipur, Rajasthan", city: "Jaipur", state: "Rajasthan", fees: 140000, rating: 4.3, placementPercentage: 85, establishedYear: 1963, type: "Government", description: "MNIT Jaipur is a prestigious NIT in North India with strong placements in core and IT sectors.", acceptedExams: ["JEE Main"] },

    // ── IIITs (JEE Main) ──
    { name: "IIIT Hyderabad", location: "Hyderabad, Telangana", city: "Hyderabad", state: "Telangana", fees: 300000, rating: 4.7, placementPercentage: 96, establishedYear: 1998, type: "Government", description: "IIIT Hyderabad excels in computer science and AI research with a research-driven curriculum.", acceptedExams: ["JEE Main"] },
    { name: "IIIT Bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", fees: 400000, rating: 4.6, placementPercentage: 95, establishedYear: 1999, type: "Government", description: "IIIT Bangalore focuses on IT in India's Silicon Valley with exceptional tech placements.", acceptedExams: ["JEE Main"] },
    { name: "IIIT Allahabad", location: "Prayagraj, Uttar Pradesh", city: "Prayagraj", state: "Uttar Pradesh", fees: 180000, rating: 4.4, placementPercentage: 88, establishedYear: 1999, type: "Government", description: "IIIT Allahabad is known for strong CS and IT programs with good industry connections.", acceptedExams: ["JEE Main"] },
    { name: "IIIT Delhi", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 350000, rating: 4.5, placementPercentage: 93, establishedYear: 2008, type: "Government", description: "IIIT Delhi is a state university focused on CS and electronics with top-notch placements.", acceptedExams: ["JEE Main"] },

    // ── Private Engineering ──
    { name: "BITS Pilani", location: "Pilani, Rajasthan", city: "Pilani", state: "Rajasthan", fees: 500000, rating: 4.7, placementPercentage: 92, establishedYear: 1964, type: "Private", description: "BITS Pilani is a top private engineering college with a unique practice school system and startup culture.", acceptedExams: ["BITSAT"] },
    { name: "BITS Goa", location: "Zuarinagar, Goa", city: "Zuarinagar", state: "Goa", fees: 500000, rating: 4.5, placementPercentage: 88, establishedYear: 2004, type: "Private", description: "BITS Pilani Goa campus offers the same rigorous curriculum as the Pilani campus in a coastal setting.", acceptedExams: ["BITSAT"] },
    { name: "VIT Vellore", location: "Vellore, Tamil Nadu", city: "Vellore", state: "Tamil Nadu", fees: 200000, rating: 4.5, placementPercentage: 90, establishedYear: 1984, type: "Private", description: "VIT is a leading private university known for international collaborations and consistent placement records.", acceptedExams: ["VITEEE"] },
    { name: "VIT Chennai", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", fees: 210000, rating: 4.3, placementPercentage: 86, establishedYear: 2010, type: "Private", description: "VIT Chennai campus offers quality education with modern infrastructure near India's IT hub.", acceptedExams: ["VITEEE"] },
    { name: "VIT Bhopal", location: "Bhopal, Madhya Pradesh", city: "Bhopal", state: "Madhya Pradesh", fees: 190000, rating: 4.1, placementPercentage: 82, establishedYear: 2017, type: "Private", description: "VIT Bhopal is a newer campus offering VIT's quality education in central India.", acceptedExams: ["VITEEE"] },
    { name: "SRM Institute", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", fees: 250000, rating: 4.3, placementPercentage: 85, establishedYear: 1985, type: "Private", description: "SRM Institute is a comprehensive university offering diverse programs with global partnerships.", acceptedExams: ["SRMJEE"] },
    { name: "SRM Amaravati", location: "Amaravati, Andhra Pradesh", city: "Amaravati", state: "Andhra Pradesh", fees: 200000, rating: 4.0, placementPercentage: 78, establishedYear: 2017, type: "Private", description: "SRM University AP offers SRM's quality education in Andhra Pradesh's new capital region.", acceptedExams: ["SRMJEE"] },
    { name: "Manipal Institute of Technology", location: "Manipal, Karnataka", city: "Manipal", state: "Karnataka", fees: 450000, rating: 4.4, placementPercentage: 87, establishedYear: 1957, type: "Private", description: "MIT Manipal is a top private engineering college with a beautiful campus and strong global alumni network.", acceptedExams: ["JEE Main", "State CET"] },
    { name: "Thapar Institute", location: "Patiala, Punjab", city: "Patiala", state: "Punjab", fees: 340000, rating: 4.2, placementPercentage: 83, establishedYear: 1956, type: "Private", description: "Thapar Institute is a leading private institution in North India for CS and electronics engineering.", acceptedExams: ["JEE Main", "State CET"] },
    { name: "Amity University", location: "Noida, Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", fees: 350000, rating: 3.8, placementPercentage: 75, establishedYear: 2005, type: "Private", description: "Amity University is one of India's largest private universities with international collaborations.", acceptedExams: ["JEE Main", "State CET"] },
    { name: "LPU", location: "Phagwara, Punjab", city: "Phagwara", state: "Punjab", fees: 200000, rating: 3.7, placementPercentage: 72, establishedYear: 2005, type: "Private", description: "Lovely Professional University offers diverse programs across a massive campus with strong industry ties.", acceptedExams: ["JEE Main", "State CET"] },

    // ── State / Others (JEE Main + State CET) ──
    { name: "Delhi Technological University", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 170000, rating: 4.4, placementPercentage: 88, establishedYear: 1941, type: "Government", description: "Formerly DCE, DTU is one of the oldest and most prestigious engineering institutions in Delhi.", acceptedExams: ["JEE Main", "State CET"] },
    { name: "NSUT Delhi", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 160000, rating: 4.3, placementPercentage: 86, establishedYear: 1983, type: "Government", description: "NSUT is a leading state university in Delhi known for excellent placements and competitive programming culture.", acceptedExams: ["JEE Main", "State CET"] },
    { name: "College of Engineering Pune", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", fees: 120000, rating: 4.4, placementPercentage: 84, establishedYear: 1854, type: "Government", description: "COEP is one of the oldest engineering colleges in Asia with strong Pune IT industry connections.", acceptedExams: ["JEE Main", "State CET"] },
    { name: "Jadavpur University", location: "Kolkata, West Bengal", city: "Kolkata", state: "West Bengal", fees: 50000, rating: 4.5, placementPercentage: 82, establishedYear: 1955, type: "Government", description: "Jadavpur University is prestigious for engineering and arts, offering affordable quality education.", acceptedExams: ["JEE Main", "State CET"] },
    { name: "RVCE Bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", fees: 350000, rating: 4.3, placementPercentage: 85, establishedYear: 1963, type: "Private", description: "RV College of Engineering benefits from proximity to major IT companies in Bangalore's tech hub.", acceptedExams: ["JEE Main", "State CET"] },
    { name: "PSG College of Technology", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", state: "Tamil Nadu", fees: 180000, rating: 4.3, placementPercentage: 86, establishedYear: 1951, type: "Private", description: "PSG Tech is highly regarded in South India for disciplined academics and strong core engineering placements.", acceptedExams: ["JEE Main", "State CET"] },

    // ── Medical (NEET) ──
    { name: "AIIMS Delhi", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 8000, rating: 4.9, placementPercentage: 99, establishedYear: 1956, type: "Government", description: "All India Institute of Medical Sciences Delhi is India's premier medical institution with world-class research facilities.", acceptedExams: ["NEET"] },
    { name: "AIIMS Bhopal", location: "Bhopal, Madhya Pradesh", city: "Bhopal", state: "Madhya Pradesh", fees: 8000, rating: 4.5, placementPercentage: 95, establishedYear: 2012, type: "Government", description: "AIIMS Bhopal is a newer AIIMS offering the same standard of medical education in central India.", acceptedExams: ["NEET"] },
    { name: "AIIMS Jodhpur", location: "Jodhpur, Rajasthan", city: "Jodhpur", state: "Rajasthan", fees: 8000, rating: 4.4, placementPercentage: 93, establishedYear: 2012, type: "Government", description: "AIIMS Jodhpur provides premier medical education in Rajasthan with modern hospital facilities.", acceptedExams: ["NEET"] },
    { name: "JIPMER Puducherry", location: "Puducherry, Puducherry", city: "Puducherry", state: "Puducherry", fees: 15000, rating: 4.8, placementPercentage: 97, establishedYear: 1823, type: "Government", description: "JIPMER is one of India's oldest and most prestigious medical institutes, an Institution of National Importance.", acceptedExams: ["NEET"] },
    { name: "CMC Vellore", location: "Vellore, Tamil Nadu", city: "Vellore", state: "Tamil Nadu", fees: 60000, rating: 4.8, placementPercentage: 96, establishedYear: 1900, type: "Private", description: "Christian Medical College Vellore is among India's top medical colleges, known for clinical excellence.", acceptedExams: ["NEET"] },
    { name: "AFMC Pune", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", fees: 5000, rating: 4.7, placementPercentage: 100, establishedYear: 1948, type: "Government", description: "Armed Forces Medical College Pune trains military medical officers with 100% placement guarantee.", acceptedExams: ["NEET"] },
    { name: "Maulana Azad Medical College", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 30000, rating: 4.6, placementPercentage: 94, establishedYear: 1958, type: "Government", description: "MAMC Delhi is one of the top government medical colleges with excellent clinical training at associated hospitals.", acceptedExams: ["NEET"] },
    { name: "KMC Manipal", location: "Manipal, Karnataka", city: "Manipal", state: "Karnataka", fees: 1200000, rating: 4.5, placementPercentage: 90, establishedYear: 1953, type: "Private", description: "Kasturba Medical College Manipal is a leading private medical college with state-of-the-art facilities.", acceptedExams: ["NEET"] },

    // ── Management (CAT) ──
    { name: "IIM Ahmedabad", location: "Ahmedabad, Gujarat", city: "Ahmedabad", state: "Gujarat", fees: 2300000, rating: 4.9, placementPercentage: 100, establishedYear: 1961, type: "Government", description: "IIM Ahmedabad is India's top management institute, known for iconic red-brick campus and 100% placements.", acceptedExams: ["CAT"] },
    { name: "IIM Bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", fees: 2400000, rating: 4.9, placementPercentage: 100, establishedYear: 1973, type: "Government", description: "IIM Bangalore combines academic excellence with proximity to India's tech capital for unmatched placements.", acceptedExams: ["CAT"] },
    { name: "IIM Calcutta", location: "Kolkata, West Bengal", city: "Kolkata", state: "West Bengal", fees: 2700000, rating: 4.9, placementPercentage: 100, establishedYear: 1961, type: "Government", description: "IIM Calcutta is India's first IIM, renowned for finance specialization and strong corporate connections.", acceptedExams: ["CAT"] },
    { name: "IIM Lucknow", location: "Lucknow, Uttar Pradesh", city: "Lucknow", state: "Uttar Pradesh", fees: 2000000, rating: 4.8, placementPercentage: 99, establishedYear: 1984, type: "Government", description: "IIM Lucknow is a top-5 IIM known for strong operations management and consistent placements.", acceptedExams: ["CAT"] },
    { name: "IIM Indore", location: "Indore, Madhya Pradesh", city: "Indore", state: "Madhya Pradesh", fees: 2100000, rating: 4.7, placementPercentage: 98, establishedYear: 1996, type: "Government", description: "IIM Indore is among the newer generation IIMs that has rapidly risen to top-10 B-school rankings.", acceptedExams: ["CAT"] },
    { name: "IIM Kozhikode", location: "Kozhikode, Kerala", city: "Kozhikode", state: "Kerala", fees: 2200000, rating: 4.7, placementPercentage: 98, establishedYear: 1996, type: "Government", description: "IIM Kozhikode is set in scenic Kerala hills, known for marketing specialization and live-in-lab innovation.", acceptedExams: ["CAT"] },
    { name: "XLRI Jamshedpur", location: "Jamshedpur, Jharkhand", city: "Jamshedpur", state: "Jharkhand", fees: 2600000, rating: 4.7, placementPercentage: 100, establishedYear: 1949, type: "Private", description: "XLRI is one of India's oldest B-schools, known for HR management excellence and strong ethics focus.", acceptedExams: ["CAT"] },
    { name: "FMS Delhi", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 20000, rating: 4.6, placementPercentage: 98, establishedYear: 1954, type: "Government", description: "Faculty of Management Studies Delhi offers the best ROI among B-schools with minimal fees and top placements.", acceptedExams: ["CAT"] },
    { name: "SPJIMR Mumbai", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", fees: 1900000, rating: 4.6, placementPercentage: 97, establishedYear: 1981, type: "Private", description: "SP Jain Mumbai is a top private B-school known for its unique pedagogy and strong Mumbai corporate network.", acceptedExams: ["CAT"] },
    { name: "MDI Gurgaon", location: "Gurugram, Haryana", city: "Gurugram", state: "Haryana", fees: 2100000, rating: 4.5, placementPercentage: 96, establishedYear: 1973, type: "Private", description: "Management Development Institute is located in India's corporate capital with excellent consulting placements.", acceptedExams: ["CAT"] },

    // ── Degree / General (CUET) ──
    { name: "St. Stephen's College", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 50000, rating: 4.6, placementPercentage: 85, establishedYear: 1881, type: "Government", description: "St. Stephen's is India's most prestigious arts college, known for its Gothic architecture and illustrious alumni.", acceptedExams: ["CUET"] },
    { name: "Hindu College", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 35000, rating: 4.5, placementPercentage: 82, establishedYear: 1899, type: "Government", description: "Hindu College Delhi University is among the top colleges for arts, science, and commerce in India.", acceptedExams: ["CUET"] },
    { name: "Miranda House", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", fees: 30000, rating: 4.6, placementPercentage: 80, establishedYear: 1948, type: "Government", description: "Miranda House is consistently ranked India's top women's college with excellent academic standards.", acceptedExams: ["CUET"] },
    { name: "Loyola College Chennai", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", fees: 45000, rating: 4.4, placementPercentage: 78, establishedYear: 1925, type: "Private", description: "Loyola College Chennai is a prestigious institution known for arts, science, and commerce education.", acceptedExams: ["CUET"] },
    { name: "St. Xavier's College Kolkata", location: "Kolkata, West Bengal", city: "Kolkata", state: "West Bengal", fees: 40000, rating: 4.5, placementPercentage: 80, establishedYear: 1860, type: "Private", description: "St. Xavier's Kolkata is one of India's oldest colleges, known for academic excellence and cultural heritage.", acceptedExams: ["CUET"] },
    { name: "Christ University", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", fees: 120000, rating: 4.3, placementPercentage: 82, establishedYear: 1969, type: "Private", description: "Christ University Bangalore is a premier institution for BBA, B.Com, and liberal arts with strong placements.", acceptedExams: ["CUET"] },
    { name: "Presidency University Kolkata", location: "Kolkata, West Bengal", city: "Kolkata", state: "West Bengal", fees: 15000, rating: 4.4, placementPercentage: 75, establishedYear: 1817, type: "Government", description: "Presidency University is one of the oldest educational institutions in Asia with rich academic heritage.", acceptedExams: ["CUET"] },
    { name: "Fergusson College Pune", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", fees: 25000, rating: 4.2, placementPercentage: 73, establishedYear: 1885, type: "Government", description: "Fergusson College Pune is a premier institution for science and arts in western India.", acceptedExams: ["CUET"] },
  ];

  // Course templates by domain
  const courseTemplates: Record<string, { courseName: string; duration: string }[]> = {
    Engineering: [
      { courseName: "B.Tech Computer Science", duration: "4 years" },
      { courseName: "B.Tech Electrical Engineering", duration: "4 years" },
      { courseName: "B.Tech Mechanical Engineering", duration: "4 years" },
      { courseName: "B.Tech Civil Engineering", duration: "4 years" },
      { courseName: "M.Tech Computer Science", duration: "2 years" },
    ],
    Medical: [
      { courseName: "MBBS", duration: "5.5 years" },
      { courseName: "BDS", duration: "5 years" },
      { courseName: "B.Sc Nursing", duration: "4 years" },
      { courseName: "MD General Medicine", duration: "3 years" },
      { courseName: "MS General Surgery", duration: "3 years" },
    ],
    Management: [
      { courseName: "MBA/PGDM", duration: "2 years" },
      { courseName: "Executive MBA", duration: "1 year" },
      { courseName: "PhD in Management", duration: "4 years" },
      { courseName: "FPM (Fellow Programme)", duration: "4 years" },
    ],
    Degree: [
      { courseName: "B.A. Honours English", duration: "3 years" },
      { courseName: "B.Sc Honours Physics", duration: "3 years" },
      { courseName: "B.Com Honours", duration: "3 years" },
      { courseName: "M.A. Economics", duration: "2 years" },
      { courseName: "B.A. Honours History", duration: "3 years" },
    ],
  };

  // Determine domain for course assignment
  function getDomain(college: typeof colleges[0]): string {
    if (college.acceptedExams.some(e => ["NEET"].includes(e))) return "Medical";
    if (college.acceptedExams.some(e => ["CAT"].includes(e))) return "Management";
    if (college.acceptedExams.some(e => ["CUET"].includes(e))) return "Degree";
    return "Engineering";
  }

  for (const college of colleges) {
    const created = await prisma.college.create({ data: college });

    const domain = getDomain(college);
    const templates = courseTemplates[domain] || courseTemplates["Engineering"];
    const count = 3 + Math.floor(Math.random() * 3);
    const selected = templates.slice(0, count);

    for (const course of selected) {
      await prisma.course.create({
        data: { courseName: course.courseName, duration: course.duration, collegeId: created.id },
      });
    }
  }

  console.log(`✅ Seeded ${colleges.length} colleges with courses!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
