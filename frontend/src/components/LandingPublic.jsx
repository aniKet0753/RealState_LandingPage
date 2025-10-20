import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";

export default function LandingPublic() {
  const { shareId } = useParams(); // 👈 comes from /landing/:shareId route
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch landing page data from backend
  useEffect(() => {
    const fetchPage = async () => {
      try {
const res = await axios.get(`/api/landing-pages/share/${shareId}`);
        setPageData(res.data);
      } catch (err) {
        console.error("Error loading shared page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading your page...
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Page not found or unavailable.
      </div>
    );
  }

  const {
    title,
    address,
    price,
    description,
    highlights = [],
    property_details = {},
    features = {},
    property_images = {},
    editable_tabs = [],
  } = pageData;

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto">
      {/* HERO SECTION */}
      <section className="px-6 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <img
              src={property_images.main}
              alt="Main Property"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["img1", "img2", "img3", "img4"].map((key) =>
              property_images[key] ? (
                <img
                  key={key}
                  src={property_images[key]}
                  alt={key}
                  className="rounded-lg object-cover w-full h-[190px]"
                />
              ) : null
            )}
          </div>
        </div>

        {/* PROPERTY DETAILS */}
        <div className="mt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="text-gray-300 mt-2">{address}</p>
          </div>
          <div className="text-4xl font-extrabold text-orange-500">{price}</div>
        </div>
      </section>

      {/* DESCRIPTION SECTION */}
      <section className="bg-white text-black py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-gray-800 leading-relaxed text-[17px] whitespace-pre-line">
              {description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-10 mt-10">
              {Object.entries(property_details).map(([key, value]) => (
                <div key={key}>
                  <p className="text-gray-500 text-sm capitalize">{key}</p>
                  <p className="font-bold text-[15px] mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS SECTION */}
      <section className="bg-black text-white py-20 px-4 md:px-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="hidden md:flex md:col-span-1 justify-center items-center">
            <h2 className="text-[64px] font-serif rotate-[-90deg] whitespace-nowrap tracking-wide">
              Highlights
            </h2>
          </div>

          <div className="md:col-span-6">
            <img
              src={pageData.highlights_image || property_images.img1}
              alt="Highlights"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>

          <div className="md:col-span-5 space-y-10 md:pl-10">
            {highlights.map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <h3 className="text-5xl font-serif text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </h3>
                <div>
                  <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white text-black py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {Object.entries(features).map(([section, list]) => (
            <div key={section}>
              <h3 className="text-xl font-semibold mb-4 capitalize">
                {section.replace("_", " ")}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                {list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* NEIGHBORHOOD TABS */}
      <section className="bg-white text-black py-20 px-6 md:px-20 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-12">
            Know Your Neighborhood
          </h2>
          {editable_tabs.map((tab) => (
            <div key={tab.id} className="mb-10">
              <h3 className="text-2xl font-semibold mb-3">{tab.title}</h3>
              <p className="text-gray-700 text-[17px] leading-relaxed">
                {tab.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 px-6 md:px-20 flex justify-center items-center">
  <div className="w-full max-w-6xl h-[500px] rounded-lg overflow-hidden shadow-md border border-gray-300">
    <iframe
      title="Google Map - Phoenix Home Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.9336157845593!2d-111.97169472363773!3d33.46626617338757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b0a50a66b13e3%3A0x4cb41dc8cfe9a6b5!2s4714%20E%20Lewis%20Ave%2C%20Phoenix%2C%20AZ%2085008!5e0!3m2!1sen!2sin!4v1715727155651!5m2!1sen!2sin"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</section>


 {/* AGENT SECTION */}
<section className="bg-black text-white py-24 px-6 md:px-20">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
    {/* LEFT: Agent Image */}
    <div className="flex justify-center">
      <img
        src="https://static.wixstatic.com/media/a94025_22da67a870ca42bc8d913704b296b788~mv2.png/v1/fill/w_1070,h_836,fp_0.48_0.22,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Michael-2_heic.png"
        alt="Michael Karabatsos"
        className="w-full max-w-lg rounded-lg object-cover"
      />
    </div>

    {/* RIGHT: Text Section */}
    <div className="space-y-6">
      <h2 className="text-4xl font-semibold leading-tight">
        Your Trusted Guide in Arizona’s Elite Real Estate Market
      </h2>
      <p className="text-gray-300 leading-relaxed text-[16px]">
        At AZ Signature Homes, we don’t just sell real estate—we deliver
        exceptional outcomes. Whether you’re buying, selling, or relocating, we
        offer a high-touch, high-performance experience rooted in market
        expertise, smart technology, and personalized service.
      </p>
      <p className="text-gray-300 text-[16px]">
        Serving <b>Scottsdale, Paradise Valley, Phoenix, Fountain Hills</b> and
        other regions of Arizona.
      </p>

      {/* Divider */}
      <div className="border-t border-gray-500 w-full my-6"></div>

      {/* Agent Info */}
      <div>
        <p className="text-lg font-semibold">Michael Karabatsos</p>
        <p className="text-gray-400 text-sm">
          Founder of Arizona Signature Homes
        </p>
      </div>

{/* Social Icons (with Image src) */}
<div className="flex gap-6 mt-4">
  <a
    href="https://www.instagram.com/azsignaturehomes/"
    target="_blank"
    rel="noopener noreferrer"
    className="transition transform hover:scale-110 duration-200"
  >
    <img
      src="https://static.wixstatic.com/media/11062b_603340b7bcb14e7785c7b65b233cd9f9~mv2.png/v1/fill/w_43,h_43,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_603340b7bcb14e7785c7b65b233cd9f9~mv2.png"
      alt="Instagram"
      className="w-8 h-8 rounded-full hover:opacity-80 transition"
    />
  </a>

  <a
    href="https://www.facebook.com/profile.php?id=61555614735183"
    target="_blank"
    rel="noopener noreferrer"
    className="transition transform hover:scale-110 duration-200"
  >
    <img
      src="https://static.wixstatic.com/media/11062b_f4e3e7f537ff4762a1914aa14e3e36b9~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_f4e3e7f537ff4762a1914aa14e3e36b9~mv2.png"
      alt="Facebook"
      className="w-8 h-8 rounded-full hover:opacity-80 transition"
    />
  </a>

  <a
    href="https://www.youtube.com/@azsignaturehomes"
    target="_blank"
    rel="noopener noreferrer"
    className="transition transform hover:scale-110 duration-200"
  >
    <img
      src="https://static.wixstatic.com/media/11062b_c67939a99eaf442d95d3f851857ceedf~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_c67939a99eaf442d95d3f851857ceedf~mv2.png"
      alt="YouTube"
      className="w-8 h-8 rounded-full hover:opacity-80 transition"
    />
  </a>

  <a
    href="https://www.tiktok.com/@azsignaturehomes?_t=ZP-8x8VokuruLH&_r=1"
    target="_blank"
    rel="noopener noreferrer"
    className="transition transform hover:scale-110 duration-200"
  >
    <img
      src="https://static.wixstatic.com/media/11062b_7edd292d29b34c309100535a26dc5033~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_7edd292d29b34c309100535a26dc5033~mv2.png"
      alt="TikTok"
      className="w-8 h-8 rounded-full hover:opacity-80 transition"
    />
  </a>
</div>



    </div>
  </div>
</section>



      {/* SIGNATURE ADVANTAGE SECTION */}
<section className="bg-black text-white py-20 px-10 text-center">
  <div className="max-w-6xl mx-auto space-y-16">
    {/* Title + Subtitle */}
    <div>
      <h2 className="text-4xl font-semibold mb-3">Our Signature Advantage</h2>
      <p className="text-gray-300 text-[17px]">
        We go beyond listings. Here’s how we make your journey seamless and successful.
      </p>
    </div>

    {/* 3 Columns */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
      {/* Discovery */}
      <div>
        <div className="border-t border-gray-400 w-3/4 mb-6"></div>
        <h3 className="text-xl font-semibold mb-2">Discovery & Customization</h3>
        <p className="text-gray-300 text-[15px] leading-relaxed">
          We take time to understand your vision—whether you’re a first-time buyer or looking
          to sell a legacy estate. Every recommendation is curated to your lifestyle and goals.
        </p>
      </div>

      {/* Exclusive Market Access */}
      <div>
        <div className="border-t border-gray-400 w-3/4 mb-6"></div>
        <h3 className="text-xl font-semibold mb-2">Exclusive Market Access</h3>
        <p className="text-gray-300 text-[15px] leading-relaxed">
          Get access to pre-market listings and private opportunities in Arizona’s most desirable
          neighborhoods — giving you the first-mover advantage in a fast-moving market.
        </p>
      </div>

      {/* Skilled Negotiation */}
      <div>
        <div className="border-t border-gray-400 w-3/4 mb-6"></div>
        <h3 className="text-xl font-semibold mb-2">Skilled Negotiation</h3>
        <p className="text-gray-300 text-[15px] leading-relaxed">
          With deep market insight and proven tactics, we negotiate every deal to protect your
          best interest — whether you’re buying your dream home or selling at the right price.
        </p>
      </div>
    </div>
  </div>
</section>

{/* FOOTER */}
<footer className="bg-black text-gray-400 text-center py-10 text-sm border-t border-gray-800">
  <div className="space-x-6 mb-4">
    <a href="#" className="hover:underline">
      Accessibility Statement
    </a>
    <a href="#" className="hover:underline">
      Privacy Policy
    </a>
    <a href="#" className="hover:underline">
      Terms & Conditions
    </a>
  </div>

  <p className="text-gray-500 text-[13px]">
    © {new Date().getFullYear()} by Arizona Signature Homes. Custom Websites Designed by Rickey Singh.
  </p>
</footer>
    </div>
  );
}
