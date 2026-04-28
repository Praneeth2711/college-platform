import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  const colleges = [
    {
      name: "IIT Bombay",
      location: "Mumbai, Maharashtra",
      city: "Mumbai",
      state: "Maharashtra",
      fees: 250000,
      rating: 4.9,
      placementPercentage: 98,
      establishedYear: 1958,
      type: "Government",
      description:
        "Indian Institute of Technology Bombay is a premier engineering institution known for cutting-edge research, world-class faculty, and exceptional placement records. Ranked consistently among the top 3 engineering colleges in India.",
    },
    {
      name: "IIT Delhi",
      location: "New Delhi, Delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 240000,
      rating: 4.9,
      placementPercentage: 97,
      establishedYear: 1961,
      type: "Government",
      description:
        "IIT Delhi is one of the most prestigious institutes in India, offering top-tier programs in engineering, science, and technology. Known for its strong alumni network and industry connections.",
    },
    {
      name: "IIT Madras",
      location: "Chennai, Tamil Nadu",
      city: "Chennai",
      state: "Tamil Nadu",
      fees: 230000,
      rating: 4.9,
      placementPercentage: 97,
      establishedYear: 1959,
      type: "Government",
      description:
        "IIT Madras is the top-ranked engineering institute in India by NIRF. Set in a sprawling campus with deer park, it excels in research output and industry partnerships.",
    },
    {
      name: "IIT Kanpur",
      location: "Kanpur, Uttar Pradesh",
      city: "Kanpur",
      state: "Uttar Pradesh",
      fees: 225000,
      rating: 4.8,
      placementPercentage: 95,
      establishedYear: 1959,
      type: "Government",
      description:
        "IIT Kanpur is renowned for its academic rigor and pioneering contributions to computer science and aerospace engineering. A hub of innovation and entrepreneurship.",
    },
    {
      name: "IIT Kharagpur",
      location: "Kharagpur, West Bengal",
      city: "Kharagpur",
      state: "West Bengal",
      fees: 220000,
      rating: 4.8,
      placementPercentage: 94,
      establishedYear: 1951,
      type: "Government",
      description:
        "The oldest IIT in India, IIT Kharagpur boasts the largest campus among all IITs. Known for its diverse academic programs and strong emphasis on holistic education.",
    },
    {
      name: "BITS Pilani",
      location: "Pilani, Rajasthan",
      city: "Pilani",
      state: "Rajasthan",
      fees: 500000,
      rating: 4.7,
      placementPercentage: 92,
      establishedYear: 1964,
      type: "Private",
      description:
        "Birla Institute of Technology and Science, Pilani is a top private engineering college with a unique practice school system. Known for its flexible academic structure and startup culture.",
    },
    {
      name: "NIT Trichy",
      location: "Tiruchirappalli, Tamil Nadu",
      city: "Trichy",
      state: "Tamil Nadu",
      fees: 150000,
      rating: 4.7,
      placementPercentage: 95,
      establishedYear: 1964,
      type: "Government",
      description:
        "NIT Tiruchirappalli is the highest-ranked NIT in India. Known for excellent placement records and a vibrant campus life with numerous technical and cultural festivals.",
    },
    {
      name: "NIT Warangal",
      location: "Warangal, Telangana",
      city: "Warangal",
      state: "Telangana",
      fees: 145000,
      rating: 4.6,
      placementPercentage: 91,
      establishedYear: 1959,
      type: "Government",
      description:
        "NIT Warangal is among the top NITs with strong industry connections and impressive placement statistics. Hosts Technozion, one of the biggest tech fests in South India.",
    },
    {
      name: "VIT Vellore",
      location: "Vellore, Tamil Nadu",
      city: "Vellore",
      state: "Tamil Nadu",
      fees: 200000,
      rating: 4.5,
      placementPercentage: 90,
      establishedYear: 1984,
      type: "Private",
      description:
        "Vellore Institute of Technology is a leading private university known for its international collaborations, state-of-the-art infrastructure, and consistent placement records.",
    },
    {
      name: "SRM Institute",
      location: "Chennai, Tamil Nadu",
      city: "Chennai",
      state: "Tamil Nadu",
      fees: 250000,
      rating: 4.3,
      placementPercentage: 85,
      establishedYear: 1985,
      type: "Private",
      description:
        "SRM Institute of Science and Technology is a comprehensive university offering diverse programs. Known for its modern campus facilities and global academic partnerships.",
    },
    {
      name: "Delhi Technological University",
      location: "New Delhi, Delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 170000,
      rating: 4.4,
      placementPercentage: 88,
      establishedYear: 1941,
      type: "Government",
      description:
        "Formerly Delhi College of Engineering, DTU is one of the oldest and most prestigious engineering institutions in Delhi. Known for strong industry connections and excellent ROI.",
    },
    {
      name: "IIIT Hyderabad",
      location: "Hyderabad, Telangana",
      city: "Hyderabad",
      state: "Telangana",
      fees: 300000,
      rating: 4.7,
      placementPercentage: 96,
      establishedYear: 1998,
      type: "Government",
      description:
        "International Institute of Information Technology, Hyderabad excels in computer science and AI research. Known for its research-driven curriculum and exceptional tech placements.",
    },
    {
      name: "NIT Surathkal",
      location: "Mangalore, Karnataka",
      city: "Mangalore",
      state: "Karnataka",
      fees: 155000,
      rating: 4.6,
      placementPercentage: 92,
      establishedYear: 1960,
      type: "Government",
      description:
        "NIT Karnataka (Surathkal) is a top-ranked NIT located near the beautiful Surathkal beach. Known for strong technical education and a closely-knit alumni network.",
    },
    {
      name: "Jadavpur University",
      location: "Kolkata, West Bengal",
      city: "Kolkata",
      state: "West Bengal",
      fees: 50000,
      rating: 4.5,
      placementPercentage: 82,
      establishedYear: 1955,
      type: "Government",
      description:
        "Jadavpur University is a prestigious public university known for its engineering and arts programs. Offers some of the most affordable quality education in India.",
    },
    {
      name: "Manipal Institute of Technology",
      location: "Manipal, Karnataka",
      city: "Manipal",
      state: "Karnataka",
      fees: 450000,
      rating: 4.4,
      placementPercentage: 87,
      establishedYear: 1957,
      type: "Private",
      description:
        "MIT Manipal is a top private engineering college known for its beautiful campus, excellent infrastructure, and a strong global alumni network spanning Fortune 500 companies.",
    },
    {
      name: "IIT Roorkee",
      location: "Roorkee, Uttarakhand",
      city: "Roorkee",
      state: "Uttarakhand",
      fees: 235000,
      rating: 4.7,
      placementPercentage: 93,
      establishedYear: 1847,
      type: "Government",
      description:
        "Originally established in 1847, IIT Roorkee is Asia's oldest technical institution. Known for civil engineering excellence and a rich heritage of engineering education.",
    },
    {
      name: "IIT Guwahati",
      location: "Guwahati, Assam",
      city: "Guwahati",
      state: "Assam",
      fees: 225000,
      rating: 4.6,
      placementPercentage: 91,
      establishedYear: 1994,
      type: "Government",
      description:
        "IIT Guwahati is set on the banks of the Brahmaputra river with a stunning campus. Known for research in nanotechnology, energy, and environmental engineering.",
    },
    {
      name: "NSUT Delhi",
      location: "New Delhi, Delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 160000,
      rating: 4.3,
      placementPercentage: 86,
      establishedYear: 1983,
      type: "Government",
      description:
        "Netaji Subhas University of Technology is a leading state university in Delhi. Known for excellent placements in tech companies and a strong competitive programming culture.",
    },
    {
      name: "RVCE Bangalore",
      location: "Bangalore, Karnataka",
      city: "Bangalore",
      state: "Karnataka",
      fees: 350000,
      rating: 4.3,
      placementPercentage: 85,
      establishedYear: 1963,
      type: "Private",
      description:
        "RV College of Engineering is a premier private engineering college in Bangalore's tech hub. Benefits from proximity to major IT companies and offers excellent industry exposure.",
    },
    {
      name: "College of Engineering Pune",
      location: "Pune, Maharashtra",
      city: "Pune",
      state: "Maharashtra",
      fees: 120000,
      rating: 4.4,
      placementPercentage: 84,
      establishedYear: 1854,
      type: "Government",
      description:
        "COEP is one of the oldest engineering colleges in Asia. Located in the heart of Pune, it offers a rich academic tradition and strong connections with the Pune IT industry.",
    },
    {
      name: "Thapar Institute",
      location: "Patiala, Punjab",
      city: "Patiala",
      state: "Punjab",
      fees: 340000,
      rating: 4.2,
      placementPercentage: 83,
      establishedYear: 1956,
      type: "Private",
      description:
        "Thapar Institute of Engineering and Technology is a leading private institution in North India. Known for strong academics in computer science and electronics engineering.",
    },
    {
      name: "PSG College of Technology",
      location: "Coimbatore, Tamil Nadu",
      city: "Coimbatore",
      state: "Tamil Nadu",
      fees: 180000,
      rating: 4.3,
      placementPercentage: 86,
      establishedYear: 1951,
      type: "Private",
      description:
        "PSG Tech is a highly regarded engineering college in South India. Known for its disciplined academic environment and strong placement record in core engineering companies.",
    },
    {
      name: "NIT Rourkela",
      location: "Rourkela, Odisha",
      city: "Rourkela",
      state: "Odisha",
      fees: 140000,
      rating: 4.4,
      placementPercentage: 88,
      establishedYear: 1961,
      type: "Government",
      description:
        "NIT Rourkela is a top NIT known for its metallurgical and mining engineering programs. Features a beautiful green campus and a vibrant research culture.",
    },
    {
      name: "IIIT Bangalore",
      location: "Bangalore, Karnataka",
      city: "Bangalore",
      state: "Karnataka",
      fees: 400000,
      rating: 4.6,
      placementPercentage: 95,
      establishedYear: 1999,
      type: "Government",
      description:
        "IIIT Bangalore focuses on IT and related areas. Located in India's Silicon Valley, it offers exceptional placements with top tech companies and a research-oriented curriculum.",
    },
    {
      name: "Amity University",
      location: "Noida, Uttar Pradesh",
      city: "Noida",
      state: "Uttar Pradesh",
      fees: 350000,
      rating: 3.8,
      placementPercentage: 75,
      establishedYear: 2005,
      type: "Private",
      description:
        "Amity University is one of India's largest private universities. Offers a wide range of programs with modern infrastructure and international academic collaborations.",
    },
  ];

  for (const college of colleges) {
    await prisma.college.create({
      data: college,
    });
  }

  // Now add courses for each college
  const allColleges = await prisma.college.findMany();

  const courseTemplates: Record<string, { courseName: string; duration: string }[]> = {
    Government: [
      { courseName: "B.Tech Computer Science", duration: "4 years" },
      { courseName: "B.Tech Electrical Engineering", duration: "4 years" },
      { courseName: "B.Tech Mechanical Engineering", duration: "4 years" },
      { courseName: "B.Tech Civil Engineering", duration: "4 years" },
      { courseName: "M.Tech Computer Science", duration: "2 years" },
    ],
    Private: [
      { courseName: "B.Tech Computer Science", duration: "4 years" },
      { courseName: "B.Tech Electronics & Communication", duration: "4 years" },
      { courseName: "B.Tech Information Technology", duration: "4 years" },
      { courseName: "BBA Business Administration", duration: "3 years" },
      { courseName: "M.Tech Data Science", duration: "2 years" },
    ],
  };

  for (const college of allColleges) {
    const courses = courseTemplates[college.type] || courseTemplates["Private"];
    const count = 3 + Math.floor(Math.random() * 3);
    const selected = courses.slice(0, count);

    for (const course of selected) {
      await prisma.course.create({
        data: {
          courseName: course.courseName,
          duration: course.duration,
          collegeId: college.id,
        },
      });
    }
  }

  console.log("✅ Seeded 25 colleges with courses!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
