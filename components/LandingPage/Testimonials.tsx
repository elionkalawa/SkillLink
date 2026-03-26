"use client";

const testimonials = [
  {
    name: "Alice Mwangi",
    role: "Frontend Developer",
    quote:
      "SkillLink helped me find real projects that boosted my portfolio. Collaborating with peers was seamless and fun!",
    img: "https://media.craiyon.com/2025-09-23/47HkNDKySEiFaF6yLUIRXw.webp", // replace with real path
  },
  {
    name: "James Kimani",
    role: "Fullstack Developer",
    quote:
      "I discovered amazing projects and learned new skills while working with talented teams. Highly recommend SkillLink!",
    img: "https://en.million-wallpapers.ru/wallpapers/4/5/small/329162937876383.jpg?hl=en",
  },
  {
    name: "Fatima Abdi",
    role: "UI/UX Designer",
    quote:
      "SkillLink made it easy to collaborate, showcase my work, and get recognized by professionals in the field.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiWKBpJaN5dGG2T-L3qZMtVUGYvZTgY44Ysg&s",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      className="py-20 bg-white dark:bg-black text-black dark:text-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900/50 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-center items-center"
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-20 h-20 rounded-full mr-4 object-cover"
              />
              <p className="text-gray-700 dark:text-gray-400 mb-4 text-center">
                “{t.quote}”
              </p>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <h4 className="font-semibold dark:text-white text-sm sm:text-base">
                    {t.name}
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                      {t.role}
                    </p>
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
