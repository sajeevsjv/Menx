import React, { useState } from "react";

const HomePage = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent by ${contactForm.name}`);
    setContactForm({ name: "", email: "", message: "" });
  };

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce platform with features like user authentication, product management, and payment integration.",
      link: "#",
    },
    {
      title: "BlogSphere",
      description:
        "A blogging platform with real-time commenting and user management.",
      link: "#",
    },
    {
      title: "Portfolio Website",
      description: "A responsive portfolio website to showcase my work.",
      link: "#",
    },
  ];

  return (
    <div className="font-sans bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-5 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">Hi, I'm John Doe</h1>
        <p className="mt-4 text-lg md:text-xl">
          MERN Stack Developer | Passionate about creating scalable web
          applications
        </p>
        <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-200 transition">
          Download Resume
        </button>
      </div>

      {/* Skills Section */}
      <div className="py-16 px-5 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">My Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "JavaScript",
            "Tailwind CSS",
            "Git",
            "API Development",
          ].map((skill, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-4 text-center hover:scale-105 transition-transform"
            >
              <p className="text-xl font-semibold">{skill}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="py-16 px-5 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-3">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <a
                href={project.link}
                className="text-blue-600 font-semibold hover:underline"
              >
                View Project
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-5 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10">Contact Me</h2>
        <p className="text-lg text-gray-700 mb-6">
          Interested in working together? Feel free to reach out!
        </p>
        <form
          className="max-w-xl mx-auto"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={contactForm.name}
            onChange={handleInputChange}
            className="w-full mb-4 px-4 py-3 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={contactForm.email}
            onChange={handleInputChange}
            className="w-full mb-4 px-4 py-3 border rounded-md"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={contactForm.message}
            onChange={handleInputChange}
            className="w-full mb-4 px-4 py-3 border rounded-md"
            rows="5"
          ></textarea>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
