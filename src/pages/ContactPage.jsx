import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_FORM_URL}`, {
      method: 'POST',
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(response => {
      if (response.code === 200) {
        toast.success("Message sent successfully!");
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
      else if (response.code === 422) {
        setError(response.message);
      }
      else {
        setError(response.message);
      }
    })
    .catch(error => {
      setError(error.message ? error.message : error);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-blue-100">
            Get in touch with our career guidance experts
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-800 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Phone</h3>
                    <p className="text-gray-600">+91 9876543210</p>
                    <p className="text-gray-600">+91 9876543211</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-800 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">support@careerpath.info</p>
                    <p className="text-gray-600">info@careerpath.info</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-800 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Address</h3>
                    <p className="text-gray-600">
                      123 Education Street,<br />
                      Knowledge City,<br />
                      India - 380001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">FAQ</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    How can I get career guidance?
                  </h3>
                  <p className="text-gray-600">
                    Fill out the contact form with your details and requirements. Our career 
                    experts will get back to you within 24 hours.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Do you provide counseling services?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we offer both online and offline counseling services. You can book 
                    an appointment through the contact form.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    What are your working hours?
                  </h3>
                  <p className="text-gray-600">
                    We are available Monday to Saturday, 9:00 AM to 6:00 PM IST. You can 
                    leave a message anytime and we'll get back to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;