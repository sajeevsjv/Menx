import React from 'react';

const ContactPage = () => {
  return (
    <div className="contact-container relative bg-gradient-to-b from-orange-300 to-orange-400 pb-9">
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-white">Contact Us</h1>
        <p className="text-lg text-gray-50 mt-2">We would love to hear from you! Feel free to reach out with any questions or feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="overflow-hidden border space-y-4  p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-white">Send Us a Message</h2>
          <form>
            <div className="mb-4">
              <input type="text" id="name" name="name" placeholder="Your Name" required className="mt-1 block bg-transparent placeholder:text-white w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="mb-4">
              <input type="email" id="email" name="email" placeholder="Your Email" required className="mt-1 block w-full bg-transparent placeholder:text-white px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="mb-4">
              <textarea id="message" name="message" placeholder="Your Message" rows="5" required className="mt-1 block w-full px-4 py-2 border bg-transparent placeholder:text-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>

            <button type="submit" className="w-full bg-white text-orange-400 hover:bg-black hover:text-white duration-300 py-3 px-4 rounded-md">Send Message</button>
          </form>
        </div>

        <div className="bg-orange-300 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Information</h2>
          <p className="mb-2"><strong>Email:</strong> support@menx.com</p>
          <p className="mb-2"><strong>Phone:</strong> +1-234-567-890</p>
          <p className="mb-4"><strong>Address:</strong> 123 Menx Street, Fashion City, FC 56789</p>

          <h3 className="text-xl font-medium text-gray-800 mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-600 hover:underline">Facebook</a>
            <a href="#" className="text-blue-600 hover:underline">Twitter</a>
            <a href="#" className="text-blue-600 hover:underline">Instagram</a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactPage;
