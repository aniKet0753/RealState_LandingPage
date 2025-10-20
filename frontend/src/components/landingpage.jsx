

import React, { useState } from "react";
import toast from "react-hot-toast";
 import PremiumPDFUploadWrapper from "./PremiumPDFUploadWrapper";
 import axios from "../api";


export default function LandingPage() {
    const [activeTab, setActiveTab] = useState("schools");
      const [modalOpen, setModalOpen] = useState(false);
      const [extractedData, setExtractedData] = useState({});
      const [editableDetails, setEditableDetails] = useState({});
      const [room, setRoom] = useState({}); // Column 2
const [construction, setConstruction] = useState({}); // Column 3
const [tax, setTax] = useState({}); // Column 4
      

      ////
      const [contactModal, setContactModal] = useState(false);
const [tourModal, setTourModal] = useState(false);
////
  const [uploadComplete, setUploadComplete] = useState(false);

// Edit mode toggle
const [isEditing, setIsEditing] = useState(false);

// Editable property info
const [property, setProperty] = useState({
  title: "",
  address: "",
  details: "",
  price: "",
  description: ``,
});

// Editable highlights
const [highlights, setHighlights] = useState([
  { id: 1, title: "", text: "" },
  { id: 2, title: "", text: "" },
  { id: 3, title: "", text: "" },
]);

// Add highlight item
const addHighlight = () => {
  const newHighlight = { id: Date.now(), title: "New Highlight", text: "Add description here..." };
  setHighlights([...highlights, newHighlight]);
};

// Editable property details
const [propertyDetails, setPropertyDetails] = useState({
  type: "",
  bedrooms: "",
  bathrooms: "",
  stories: "",
  area: "",
  pool: "",
});

// Editable property features
const [features, setFeatures] = useState({
  exterior: [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  interior: [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  utilities: [
    "",
    "",
    "",
    "",
    "",
    "",
  ],
});


// Editable neighborhood info 
// Editable property images (Hero section)
const [propertyImages, setPropertyImages] = useState({
  main: "",
  img1: "",
  img2: "",
  img3: "",
  img4: "",
});

// Editable Highlights Section Image
const [highlightsImage, setHighlightsImage] = useState(
  ""
);

// Handle image upload for edit mode
const handleImageChange = (e, key) => {
  const file = e.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setPropertyImages({ ...propertyImages, [key]: imageUrl });
  }
};

   const tabs = [
    {
      id: "",
      title: "",
      content: ``,
    },
    {
      id: "",
      title: "",
      content: ``,
    },
    {
      id: "",
      title: "",
      content: ``,
    },
  ];
  const [editableTabs, setEditableTabs] = useState(tabs);
////////////////////
////////
// Save edits in localStorage
React.useEffect(() => {
  localStorage.setItem("propertyDetails", JSON.stringify(propertyDetails));
  localStorage.setItem("features", JSON.stringify(features));
  localStorage.setItem("editableTabs", JSON.stringify(editableTabs));
  localStorage.setItem("propertyImages", JSON.stringify(propertyImages));
  localStorage.setItem("highlightsImage", highlightsImage);
}, [propertyDetails, features, editableTabs, propertyImages, highlightsImage]);


React.useEffect(() => {
  const savedDetails = localStorage.getItem("propertyDetails");
  const savedFeatures = localStorage.getItem("features");
  const savedTabs = localStorage.getItem("editableTabs");
  if (savedDetails) setPropertyDetails(JSON.parse(savedDetails));
  if (savedFeatures) setFeatures(JSON.parse(savedFeatures));
  if (savedTabs) setEditableTabs(JSON.parse(savedTabs));
  const savedImages = localStorage.getItem("propertyImages");
if (savedImages) setPropertyImages(JSON.parse(savedImages));
const savedHighlightsImage = localStorage.getItem("highlightsImage");
if (savedHighlightsImage) setHighlightsImage(savedHighlightsImage);

}, []);

 // If upload not done yet — show the PremiumPDFUpload
const handleUploadComplete = (data) => {
  try {
    // ✅ Extracted data from AI (from /extract-pdf)
    const extracted = data?.data || {};
setExtractedData(extracted);
//frst coloum
setEditableDetails({
  "Garage Spaces": extracted?.features?.garage?.spaces || "",
  "Carport Spaces": extracted?.features?.garage?.carportSpaces || "",
  "Total Covered Spaces": extracted?.features?.garage?.totalCovered || "",
  "Parking Features": (extracted?.features?.garage?.parkingFeatures || []).join("; "),
  "Pool Features": extracted?.features?.pool?.type || "",
  "Fireplace": extracted?.features?.fireplace || "",
  "Property Description": (extracted?.features?.propertyDescription || []).join("; "),
  "Exterior Features": (extracted?.features?.exteriorFeatures || []).join("; "),
  "Community Features": (extracted?.features?.communityFeatures || []).join("; "),
  "Flooring": (extracted?.features?.flooring || []).join("; "),
});
//SECOUND COLOUM FOR EDITION 
// Column 2 — Room Details
setRoom({
  "Kitchen Features": (extracted?.features?.kitchenFeatures || []).join("; "),
  "Master Bathroom": extracted?.features?.masterBathroom || "",
  "Master Bedroom": extracted?.features?.masterBedroom || "",
  "Additional Bedroom": (extracted?.features?.additionalBedroom || []).join("; "),
  "Laundry": (extracted?.features?.laundry || []).join("; "),
  "Dining Area": extracted?.features?.diningArea || "",
  "Basement": extracted?.features?.basement || "",
  "Den / Office": extracted?.features?.denOffice || "",
});

// Column 3 — Construction & Utilities
setConstruction({
  "Architecture": extracted?.construction?.architecture || "",
  "Building Style": extracted?.construction?.buildingStyle || "",
  "Unit Style": (extracted?.construction?.unitStyle || []).join("; "),
  "Const - Finish": extracted?.construction?.constFinish || "",
  "Construction": extracted?.construction?.construction || "",
  "Roofing": extracted?.construction?.roofing || "",
  "Fencing": extracted?.construction?.fencing || "",
  "Cooling": (extracted?.construction?.cooling || []).join("; "),
  "Heating": extracted?.construction?.heating || "",
  "Utilities": (extracted?.construction?.utilities || []).join("; "),
  "Water Source": extracted?.construction?.waterSource || "",
  "Sewer": extracted?.construction?.sewer || "",
});

// Column 4 — County, Tax & Financing
setTax({
  "County Code": extracted?.taxInfo?.countyCode || "",
  "Legal Description": extracted?.taxInfo?.legalDescription || "",
  "Lot Number": extracted?.taxInfo?.lotNumber || "",
  "Town-Range-Section": extracted?.taxInfo?.townRangeSection || "",
  "Taxes/Yr": extracted?.taxInfo?.taxesPerYear || "",
  "Ownership": extracted?.taxInfo?.ownership || "",
  "New Financing": extracted?.taxInfo?.newFinancing || "",
  "Existing Loan": extracted?.taxInfo?.existingLoan || "",
  "Disclosures": (extracted?.taxInfo?.disclosures || []).join("; "),
  "Possession": extracted?.taxInfo?.possession || "",
});


    // 1️⃣ Property Info
    setProperty({
      title:
        extracted.property?.title ||
        `${extracted.property?.propertyType || ""} in ${
          extracted.property?.city || ""
        }`,
      address: `${extracted.property?.address || ""}, ${
        extracted.property?.city || ""
      }, ${extracted.property?.state || ""} ${extracted.property?.zipCode || ""}`,
      details: `${extracted.details?.bedrooms || ""} Beds | ${
        extracted.details?.bathrooms || ""
      } Baths | ${extracted.details?.sqft || ""} SQ.FT.`,
      price: extracted.property?.price || "",
      description: extracted.description || "",
    });

    // 2️⃣ Property Details Section
    setPropertyDetails({
      type: extracted.property?.propertyType || "",
      bedrooms: extracted.details?.bedrooms || "",
      bathrooms: extracted.details?.bathrooms || "",
      stories: extracted.details?.exteriorStories || "",
      area: extracted.details?.sqft || "",
      pool: extracted.details?.pool || "",
    });

    // 3️⃣ Features (merge all lists safely)
    const ext = [
      ...(extracted.features?.exteriorFeatures || []),
      ...(extracted.features?.communityFeatures || []),
      ...(extracted.features?.propertyDescription || []),
    ];
    const interior = [
      ...(extracted.features?.kitchenFeatures || []),
      ...(extracted.features?.flooring || []),
      ...(extracted.features?.additionalBedroom || []),
    ];
    const utilities = [
      ...(extracted.construction?.cooling || []),
      ...(extracted.construction?.utilities || []),
      extracted.construction?.heating || "",
      extracted.construction?.waterSource || "",
      extracted.construction?.sewer || "",
    ].filter(Boolean);

    setFeatures({
      exterior: ext.length ? ext : [""],
      interior: interior.length ? interior : [""],
      utilities: utilities.length ? utilities : [""],
    });

    // 4️⃣ Schools → Tabs (auto-fill)
    setEditableTabs([
      {
        id: "schools",
        title: "Schools",
        content: `Elementary: ${
          extracted.schools?.elementarySchool || "N/A"
        }\nHigh School: ${extracted.schools?.highSchool || "N/A"}\nDistrict: ${
          extracted.schools?.highSchoolDistrict || "N/A"
        }`,
      },
      {
        id: "location",
        title: "Location",
        content: `${extracted.location?.directions || ""}`,
      },
      {
        id: "taxInfo",
        title: "Tax Info",
        content: `County: ${
          extracted.taxInfo?.countyCode || ""
        }\nOwnership: ${extracted.taxInfo?.ownership || ""}\nTaxes: ${
          extracted.taxInfo?.taxesPerYear || ""
        }`,
      },
    ]);

    // 5️⃣ Optionally create highlights from main points
    const highlightList = [];
    if (extracted.details?.yearBuilt)
      highlightList.push({
        id: 1,
        title: "Year Built",
        text: extracted.details.yearBuilt,
      });
    if (extracted.details?.pool)
      highlightList.push({
        id: 2,
        title: "Pool",
        text: extracted.details.pool,
      });
    if (extracted.features?.fireplace)
      highlightList.push({
        id: 3,
        title: "Fireplace",
        text: extracted.features.fireplace,
      });

    setHighlights(highlightList.length ? highlightList : [{ id: 1, title: "", text: "" }]);

    // 6️⃣ Mark upload complete
    setUploadComplete(true);
    toast.success("✅ PDF data successfully extracted and applied!");
  } catch (err) {
    console.error("Error applying data:", err);
    toast.error("❌ Failed to map extracted data to page");
  }
};

   if (!uploadComplete) {
   return <PremiumPDFUploadWrapper onUploadComplete={handleUploadComplete} />;
 }

  return (
    <div className="min-h-screen overflow-y-auto bg-black text-white font-sans scroll-smooth">
{/* HERO SECTION */}
<>
      {/* HERO SECTION */}
    <section className="relative bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white px-6 lg:px-20 py-16 overflow-hidden">
  <div className="max-w-7xl mx-auto space-y-10">
    
    {/* ======= Utility Buttons (Share / Edit) ======= */}
    <div className="flex justify-end items-center gap-3 mb-4">
      <button
        onClick={async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/landing-pages/save-full`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: property.title,
                address: property.address,
                details: property.details,
                price: property.price,
                description: property.description,
                highlights,
                propertyDetails,
                features,
                propertyImages,
                editableTabs,
                  editableDetails, 
                  room,          
                  construction, 
                  tax,

              }),
            });

            if (!response.ok) throw new Error("Failed to save");
            const data = await response.json();
            navigator.clipboard.writeText(data.public_url);
           toast.custom((t) => (
  <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } max-w-md w-full bg-gray-900 text-white rounded-2xl shadow-lg border border-gray-700 p-5 flex flex-col gap-3`}
  >
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white font-bold">
        ✓
      </div>
      <div className="flex-1">
        <p className="text-lg font-semibold">Landing Page Saved!</p>
        <p className="text-sm text-gray-400 mt-0.5">
          Your shareable link is ready below 👇
        </p>
      </div>
    </div>

    <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm font-mono flex justify-between items-center mt-1">
      <span className="truncate">{data.public_url}</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(data.public_url);
          toast.success("✅ Link copied!", { duration: 1500 });
        }}
        className="ml-2 text-green-400 hover:text-green-300 transition"
      >
        Copy
      </button>
    </div>
  </div>
));

          } catch (error) {
            toast.error("❌ Failed to save landing page. Try again.");
          }
        }}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-md hover:shadow-green-600/20"
      >
        Save & Share
      </button>

      <button
        onClick={() => setIsEditing(!isEditing)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-md hover:shadow-blue-600/20 ${
          isEditing
            ? "bg-gray-700 hover:bg-gray-800"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {isEditing ? "Save Changes" : "Edit Page"}
      </button>
    </div>

    {/* ======= IMAGE GRID ======= */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Main Image */}
      <div className="lg:col-span-2 relative group rounded-2xl overflow-hidden">
        {propertyImages.main ? (
          <img
            src={propertyImages.main}
            alt="Main House"
            className="w-full h-[520px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <label
            htmlFor="upload-main"
            className="w-full h-[520px] flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:bg-gray-800/30 transition"
          >
            <span className="text-gray-300 text-sm font-medium">
              + Upload Main Image or Video
            </span>
            <input
              id="upload-main"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "main")}
            />
          </label>
        )}

        {isEditing && propertyImages.main && (
          <label className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-md cursor-pointer hover:bg-black/80 transition">
            Change Image
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleImageChange(e, "main")}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Right Side Grid */}
      <div className="grid grid-cols-2 gap-4">
        {["img1", "img2", "img3", "img4"].map((key) => (
          <div key={key} className="relative group rounded-xl overflow-hidden">
            {propertyImages[key] ?.trim() ? (
              <img
                src={propertyImages[key]}
                alt={key}
                className="w-full h-[245px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.05]"
              />
            ) : (
              <label
                htmlFor={`upload-${key}`}
                className="w-full h-[245px] flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:bg-gray-800/30 transition"
              >
                <span className="text-gray-300 text-xs font-medium">
                  + Upload Image/Video
                </span>
                <input
                  id={`upload-${key}`}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, key)}
                />
              </label>
            )}

            {isEditing && propertyImages[key] && (
              <label className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md cursor-pointer hover:bg-black/80 transition">
                Change
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleImageChange(e, key)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* ======= PROPERTY INFO ======= */}
    <div className="mt-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-t border-gray-800 pt-8">
      {/* Left Text Info */}
      <div className="flex-1 space-y-2">
        {isEditing ? (
          <>
            <input
              type="text"
              value={property.title}
              onChange={(e) => setProperty({ ...property, title: e.target.value })}
              className="text-3xl font-semibold bg-gray-100 text-black p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={property.address}
              onChange={(e) => setProperty({ ...property, address: e.target.value })}
              className="text-gray-600 bg-gray-100 text-black p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={property.details}
              onChange={(e) => setProperty({ ...property, details: e.target.value })}
              className="text-gray-500 text-sm bg-gray-100 text-black p-2 rounded w-full"
            />
          </>
        ) : (
          <>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
              {property.title}
            </h1>
            <p className="text-gray-400 mt-1">{property.address}</p>
            <p className="text-gray-500 text-sm">{property.details}</p>
          </>
        )}
      </div>

      {/* Right Price & CTA Buttons */}
      <div className="flex flex-col items-end gap-4">
        {isEditing ? (
          <input
            type="text"
            value={property.price}
            onChange={(e) => setProperty({ ...property, price: e.target.value })}
            className="text-4xl font-bold bg-gray-100 text-black p-2 rounded text-right w-[220px]"
          />
        ) : (
          <div className="text-4xl font-bold text-white tracking-tight">
            {property.price}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-4">
          <button
            onClick={() => setContactModal(true)}
            className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-black transition"
          >
            Get in Touch
          </button>
          <button
            onClick={() => setTourModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-medium transition"
          >
            Schedule a Tour
          </button>
        </div>
      </div>
    </div>

    {/* ======= EXTRA IMAGE MODAL (optional) ======= */}
    {modalOpen && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-black rounded-2xl max-w-5xl w-full relative shadow-lg">
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-400"
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <img
              src="https://static.wixstatic.com/media/a94025_99d4157ab52847eca25cf71248baa6f3~mv2.jpg/v1/fill/w_800,h_600,al_c,q_85,enc_avif"
              alt="Extra View 1"
              className="rounded-lg w-full object-cover"
            />
            <img
              src="https://static.wixstatic.com/media/a94025_0e4ddb9a4a4646539293ed3301197782~mv2.jpg/v1/fill/w_800,h_600,al_c,q_85,enc_avif"
              alt="Extra View 2"
              className="rounded-lg w-full object-cover"
            />
          </div>
        </div>
      </div>
    )}
  </div>
</section>

    </>

{/* DESCRIPTION SECTION */}
<section className="bg-gradient-to-b from-gray-50 via-white to-gray-100 text-black py-24 px-6 md:px-20 transition-all duration-300">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
    {/* LEFT SIDE: Description + Property Info */}
    <div className="md:col-span-2 space-y-12">
      {/* Description */}
     
      <div>
        <p className="text-bold">Public Remarks</p>
        {isEditing ? (
          <textarea
            value={property.description}
            onChange={(e) => setProperty({ ...property, description: e.target.value })}
            className="w-full bg-gray-100 text-black p-4 rounded-lg text-[17px] leading-relaxed h-60 shadow-inner focus:ring-2 focus:ring-gray-300 focus:outline-none"
          />
        ) : (
          <p className="text-gray-700 leading-relaxed text-[17px] whitespace-pre-line tracking-wide">
            {property.description}
          </p>
        )}
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-y-8 gap-x-12 bg-white/60 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        {[
          { label: "Property Type", key: "type" },
          { label: "Bedrooms", key: "bedrooms" },
          { label: "Bathrooms", key: "bathrooms" },
          { label: "Exterior Stories", key: "stories" },
          { label: "Area", key: "area" },
          { label: "Pool", key: "pool" },
        ].map((item) => (
          <div key={item.key}>
            <p className="text-gray-500 text-sm font-medium">{item.label}</p>
            {isEditing ? (
              <input
                type="text"
                value={propertyDetails[item.key]}
                onChange={(e) =>
                  setPropertyDetails({
                    ...propertyDetails,
                    [item.key]: e.target.value,
                  })
                }
                className="font-semibold text-[15px] mt-1 bg-gray-100 text-black p-2 rounded-md w-full focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
            ) : (
              <p className="font-semibold text-[15px] mt-1 text-gray-800">
                {propertyDetails[item.key] || "N/A"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT SIDE: Contact Card */}
    <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-semibold mb-4 leading-snug text-gray-800">
        Request More Information
      </h3>

      <p className="text-gray-600 text-sm mb-2 text-left font-medium">
        Message
      </p>
      <textarea
        readOnly
        value={`"Please send me more information on 4714 E LEWIS AVE, Phoenix, AZ 85008 (Listing #6857799)"`}
        className="w-full border border-gray-300 p-3 rounded-md text-sm mb-6 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
      />

      <button className="border border-black w-full py-2.5 font-semibold text-black hover:bg-black hover:text-white transition-all duration-300 rounded-md shadow-sm hover:shadow-md">
        Request Info
      </button>

      {/* Divider + Call Section */}
      <div className="flex items-center justify-center gap-4 my-8">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Or Call
        </p>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      {/* Agent Info */}
      <div className="flex items-center justify-center gap-4">
        <img
          src="https://static.wixstatic.com/media/a94025_3332239ee13049cd8e6c796b043e78a9~mv2.jpg/v1/crop/x_296,y_0,w_1292,h_1325/fill/w_88,h_91,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Michael-2_edited.jpg"
          alt="Michael Karabatsos"
          className="w-[85px] h-[85px] rounded-full object-cover shadow-md"
        />
        <div className="text-left">
          <p className="font-semibold text-[15px] text-gray-800">
            Michael Karabatsos
          </p>
          <p className="text-gray-700 text-lg font-medium mt-1">
            (602) 892 - 4939
          </p>
        </div>
      </div>
    </div>
  </div>
</section>




      {/* HIGHLIGHTS SECTION */}
{/* HIGHLIGHTS SECTION */}
<section className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white py-24 px-6 md:px-16 overflow-hidden">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
    {/* Vertical Title */}
    <div className="hidden md:flex md:col-span-1 justify-center items-center relative">
      <h2 className="text-[70px] font-serif rotate-[-90deg] whitespace-nowrap tracking-widest text-white-800/70 select-none">
        Highlights
      </h2>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-gray-600/30 via-gray-700/60 to-transparent"></div>
    </div>

    {/* Upload Image/Video for Highlights */}
    <div className="md:col-span-6 relative flex justify-center">
      <div className="relative w-full group">
        {highlightsImage ? (
          highlightsImage.endsWith(".mp4") ||
          highlightsImage.endsWith(".mov") ||
          highlightsImage.endsWith(".webm") ? (
            <video
              src={highlightsImage}
              controls
              className="rounded-2xl shadow-2xl w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <img
              src={highlightsImage}
              alt="Highlights Media"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )
        ) : (
          <label
            htmlFor="upload-highlights"
            className="w-full h-[520px] flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:bg-gray-800/30 transition"
          >
            <span className="text-gray-300 text-sm font-medium">
              + Upload Highlight Image or Video
            </span>
            <input
              id="upload-highlights"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setHighlightsImage(url);
                }
              }}
            />
          </label>
        )}

        {isEditing && highlightsImage && (
          <label className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded cursor-pointer hover:bg-white/20 transition">
            Change Media
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setHighlightsImage(url);
                }
              }}
            />
          </label>
        )}
      </div>
    </div>

    {/* Highlights Text Content */}
    <div className="md:col-span-5 space-y-10 md:pl-10">
      {highlights.map((item, index) => (
        <div
          key={item.id}
          className="flex gap-6 items-start group transition-all duration-300 hover:translate-x-1"
        >
          <h3 className="text-5xl font-serif text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
            {String(index + 1).padStart(2, "0")}
          </h3>
          <div className="space-y-1">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newHighlights = [...highlights];
                    newHighlights[index].title = e.target.value;
                    setHighlights(newHighlights);
                  }}
                  className="font-bold text-lg mb-1 bg-gray-100 text-black p-2 rounded-md w-full focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
                <textarea
                  value={item.text}
                  onChange={(e) => {
                    const newHighlights = [...highlights];
                    newHighlights[index].text = e.target.value;
                    setHighlights(newHighlights);
                  }}
                  className="text-gray-700 text-sm leading-relaxed bg-gray-100 text-black p-2 rounded-md w-full focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
              </>
            ) : (
              <>
                <h4 className="font-bold text-xl mb-1 text-white tracking-wide group-hover:text-gray-200 transition">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-[15px] leading-relaxed max-w-md">
                  {item.text}
                </p>
              </>
            )}
          </div>
        </div>
      ))}

      {isEditing && (
        <button
          onClick={addHighlight}
          className="mt-10 border border-white text-white px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:shadow-white/30 shadow-md"
        >
          + Add Highlight
        </button>
      )}
    </div>
  </div>

  {/* Background Accent */}
  <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-t from-gray-600/20 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none"></div>
</section>




      {/* PROPERTY FEATURES SECTION */}
{/* PROPERTY DETAILS TABLE SECTION */}
{/* PROPERTY DETAILS TABLE SECTION */}
<section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 text-black py-24 px-6 md:px-20">
  <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-200 backdrop-blur-sm">
    <div className="grid gap-5 grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      
      {/* Column 1 — Features */}
      <div className="p-8 bg-white hover:bg-gray-50 transition-colors duration-300">
        <h3 className="text-2xl font-semibold mb-5 border-b border-gray-200 pb-3 text-gray-800 tracking-tight">
          Features
        </h3>

        {Object.entries({
          "Garage Spaces": extractedData?.features?.garage?.spaces,
          "Carport Spaces": extractedData?.features?.garage?.carportSpaces,
          "Total Covered Spaces": extractedData?.features?.garage?.totalCovered,
          "Parking Features": (extractedData?.features?.garage?.parkingFeatures || []).join("; "),
          "Pool Features": extractedData?.features?.pool?.type,
          "Fireplace": extractedData?.features?.fireplace,
          "Property Description": (extractedData?.features?.propertyDescription || []).join("; "),
          "Exterior Features": (extractedData?.features?.exteriorFeatures || []).join("; "),
          "Community Features": (extractedData?.features?.communityFeatures || []).join("; "),
          "Flooring": (extractedData?.features?.flooring || []).join("; "),
        }).map(([key, val]) => (
          <div key={key} className="mb-3">
            <span className="font-medium text-gray-700">{key}:</span>{" "}
            {isEditing ? (
              <input
  type="text"
  value={editableDetails[key] ?? val ?? ""}
  onChange={(e) =>
    setEditableDetails({
      ...editableDetails,
      [key]: e.target.value,
    })
  }
                className="border border-gray-300 p-2 rounded-md text-sm w-full mt-1 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
            ) : (
              <span className="text-gray-600">
  {editableDetails[key] || val || "N/A"}
</span>

            )}
          </div>
        ))}
      </div>

      {/* Column 2 — Room Details */}
      <div className="p-8 bg-white hover:bg-gray-50 transition-colors duration-300">
        <h3 className="text-2xl font-semibold mb-5 border-b border-gray-200 pb-3 text-gray-800 tracking-tight">
          Room Details
        </h3>

       {Object.entries(room).map(([key, val]) => (
          <div key={key} className="mb-3">
            <span className="font-medium text-gray-700">{key}:</span>{" "}
            {isEditing ? (
              <input
                type="text"
                value={val}
                onChange={(e) =>
                  setRoom({
                    ...room,
                    [key]: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded-md text-sm w-full mt-1 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
            ) : (
              <span className="text-gray-600">
                {extractedData?.features?._editable?.[key] || val || "N/A"}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Column 3 — Construction & Utilities */}
      <div className="p-8 bg-white hover:bg-gray-50 transition-colors duration-300">
        <h3 className="text-2xl font-semibold mb-5 border-b border-gray-200 pb-3 text-gray-800 tracking-tight">
          Construction & Utilities
        </h3>

           {Object.entries(construction || {}).map(([key, val]) => (
          <div key={key} className="mb-3">
            <span className="font-medium text-gray-700">{key}:</span>{" "}
            {isEditing ? (
              <input
                type="text"
                value={val}
                onChange={(e) =>
                  setConstruction({
                    ...construction,
                    [key]: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded-md text-sm w-full mt-1 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
            ) : (
              <span className="text-gray-600">
                {extractedData?.construction?._editable?.[key] || val || "N/A"}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Column 4 — County, Tax & Financing */}
      <div className="p-8 bg-white hover:bg-gray-50 transition-colors duration-300">
        <h3 className="text-2xl font-semibold mb-5 border-b border-gray-200 pb-3 text-gray-800 tracking-tight">
          County, Tax & Financing
        </h3>

        
        {Object.entries(tax || {}).map(([key, val]) => (
          <div key={key} className="mb-3">
            <span className="font-medium text-gray-700">{key}:</span>{" "}
            {isEditing ? (
              <input
                type="text"
                value={val}
                onChange={(e) =>
                  setTax({
                    ...tax,
                    [key]: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded-md text-sm w-full mt-1 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
            ) : (
              <span className="text-gray-600">
                {extractedData?.taxInfo?._editable?.[key] || val || "N/A"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>





       {/* neighborhood section */}
<section className="bg-gradient-to-b from-white via-gray-50 to-white text-black py-24 px-6 md:px-20 text-center transition-all duration-300">
  <div className="max-w-5xl mx-auto">
    {/* Title */}
    <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-10 tracking-tight">
      Know Your Neighborhood
    </h2>

    {/* Tabs */}
    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16 border-b border-gray-300 pb-4">
      {editableTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative text-lg font-semibold transition-all duration-300 pb-2 px-1 ${
            activeTab === tab.id
              ? "text-black after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:bg-black after:rounded-full"
              : "text-gray-500 hover:text-black hover:after:content-[''] hover:after:absolute hover:after:bottom-[-2px] hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-gray-400 hover:after:rounded-full"
          }`}
        >
          {isEditing ? (
            <input
              type="text"
              value={tab.title}
              onChange={(e) => {
                const updated = editableTabs.map((t) =>
                  t.id === tab.id ? { ...t, title: e.target.value } : t
                );
                setEditableTabs(updated);
              }}
              className="bg-gray-100 text-black text-center rounded px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          ) : (
            tab.title
          )}
        </button>
      ))}
    </div>

    {/* Content */}
    <div className="mt-10 text-left md:text-center max-w-3xl mx-auto">
      {isEditing ? (
        <textarea
          value={editableTabs.find((t) => t.id === activeTab)?.content || ""}
          onChange={(e) => {
            const updated = editableTabs.map((t) =>
              t.id === activeTab ? { ...t, content: e.target.value } : t
            );
            setEditableTabs(updated);
          }}
          className="w-full bg-gray-100 text-black p-4 rounded-xl text-[17px] leading-relaxed h-48 resize-none shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
        />
      ) : (
        <p className="text-gray-700 text-[17px] leading-relaxed transition-all duration-500 ease-in-out bg-white p-6 rounded-2xl shadow-sm hover:shadow-md">
          {editableTabs.find((t) => t.id === activeTab)?.content}
        </p>
      )}
    </div>

    {/* Add Tab Button */}
    {isEditing && (
      <button
        onClick={() =>
          setEditableTabs([
            ...editableTabs,
            {
              id: `new-${Date.now()}`,
              title: "New Neighborhood",
              content: "Add details here...",
            },
          ])
        }
        className="mt-10 inline-flex items-center gap-2 border border-black px-5 py-2.5 rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:shadow-lg"
      >
        <span className="text-xl leading-none">+</span> Add Neighborhood
      </button>
    )}
  </div>
</section>


      {/* MAP SECTION  we can use map coordinator for auto locatio ot fixed */}
      
<section className="relative bg-gradient-to-b from-gray-100 via-white to-gray-100 py-24 px-6 md:px-20 flex flex-col items-center text-center">
  {/* Section Title */}

  {/* Map Container */}
  <div className="relative w-full max-w-6xl h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-gray-400/50 transition-all duration-500 ease-out group">
    {/* Subtle Glow Layer */}
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-gray-200 opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

    {/* Map */}
    <iframe
      title="Google Map - Phoenix Home Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.9336157845593!2d-111.97169472363773!3d33.46626617338757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b0a50a66b13e3%3A0x4cb41dc8cfe9a6b5!2s4714%20E%20Lewis%20Ave%2C%20Phoenix%2C%20AZ%2085008!5e0!3m2!1sen!2sin!4v1715727155651!5m2!1sen!2sin"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="group-hover:scale-[1.03] transition-transform duration-700 ease-in-out"
    ></iframe>
  </div>

  {/* Optional Contact CTA under map */}
  <div className="mt-10 text-gray-600 text-sm">
    <p>
      📍 4714 E LEWIS AVE, Phoenix, Arizona, 85008 &nbsp;|&nbsp;
      <a
        href="https://goo.gl/maps/dh6ix6x7U3S2"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200"
      >
        Open in Google Maps
      </a>
    </p>
  </div>
</section>



 {/* AGENT SECTION  from here everything is static */}
{/* HERO SECTION */}
<section className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-24 px-6 md:px-20 transition-all duration-300">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
    {/* LEFT: Agent Image */}
    <div className="flex justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ffffff1a] to-transparent rounded-3xl blur-3xl opacity-30"></div>
      <img
        src="https://static.wixstatic.com/media/a94025_22da67a870ca42bc8d913704b296b788~mv2.png/v1/fill/w_1070,h_836,fp_0.48_0.22,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Michael-2_heic.png"
        alt="Michael Karabatsos"
        className="w-full max-w-lg rounded-2xl shadow-2xl object-cover z-10 hover:scale-[1.03] transition-transform duration-300"
      />
    </div>

    {/* RIGHT: Text Section */}
    <div className="space-y-7 z-20">
      <h2 className="text-4xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Your Trusted Guide in Arizona’s Elite Real Estate Market
      </h2>

      <p className="text-gray-300 leading-relaxed text-[17px] tracking-wide">
        At AZ Signature Homes, we don’t just sell real estate—we deliver
        exceptional outcomes. Whether you’re buying, selling, or relocating, we
        offer a high-touch, high-performance experience rooted in market
        expertise, smart technology, and personalized service.
      </p>

      <p className="text-gray-400 text-[16px] italic">
        Serving <b>Scottsdale, Paradise Valley, Phoenix, Fountain Hills</b> and
        other regions of Arizona.
      </p>

      {/* Divider */}
      <div className="border-t border-gray-600 w-full my-8 opacity-50"></div>

      {/* Agent Info */}
      <div>
        <p className="text-xl font-semibold tracking-wide">Michael Karabatsos</p>
        <p className="text-gray-400 text-sm uppercase tracking-wider">
          Founder of Arizona Signature Homes
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex gap-6 mt-5">
        {[
          {
            href: "https://www.instagram.com/azsignaturehomes/",
            src: "https://static.wixstatic.com/media/11062b_603340b7bcb14e7785c7b65b233cd9f9~mv2.png/v1/fill/w_43,h_43,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_603340b7bcb14e7785c7b65b233cd9f9~mv2.png",
            alt: "Instagram",
          },
          {
            href: "https://www.facebook.com/profile.php?id=61555614735183",
            src: "https://static.wixstatic.com/media/11062b_f4e3e7f537ff4762a1914aa14e3e36b9~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_f4e3e7f537ff4762a1914aa14e3e36b9~mv2.png",
            alt: "Facebook",
          },
          {
            href: "https://www.youtube.com/@azsignaturehomes",
            src: "https://static.wixstatic.com/media/11062b_c67939a99eaf442d95d3f851857ceedf~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_c67939a99eaf442d95d3f851857ceedf~mv2.png",
            alt: "YouTube",
          },
          {
            href: "https://www.tiktok.com/@azsignaturehomes?_t=ZP-8x8VokuruLH&_r=1",
            src: "https://static.wixstatic.com/media/11062b_7edd292d29b34c309100535a26dc5033~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_7edd292d29b34c309100535a26dc5033~mv2.png",
            alt: "TikTok",
          },
        ].map((social, i) => (
          <a
            key={i}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125 duration-300"
          >
            <img
              src={social.src}
              alt={social.alt}
              className="w-9 h-9 rounded-full shadow-lg hover:shadow-white/30 transition-shadow duration-300"
            />
          </a>
        ))}
      </div>
    </div>
  </div>
</section>

{/* SIGNATURE ADVANTAGE SECTION */}
<section className="bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white py-24 px-6 md:px-16 text-center">
  <div className="max-w-6xl mx-auto space-y-16">
    {/* Title + Subtitle */}
    <div>
      <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-wide bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
        Our Signature Advantage
      </h2>
      <p className="text-gray-300 text-[17px] leading-relaxed max-w-2xl mx-auto">
        We go beyond listings. Here’s how we make your journey seamless and successful.
      </p>
    </div>

    {/* 3 Columns */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
      {[
        {
          title: "Discovery & Customization",
          text: "We take time to understand your vision—whether you’re a first-time buyer or looking to sell a legacy estate. Every recommendation is curated to your lifestyle and goals.",
        },
        {
          title: "Exclusive Market Access",
          text: "Get access to pre-market listings and private opportunities in Arizona’s most desirable neighborhoods — giving you the first-mover advantage in a fast-moving market.",
        },
        {
          title: "Skilled Negotiation",
          text: "With deep market insight and proven tactics, we negotiate every deal to protect your best interest — whether you’re buying your dream home or selling at the right price.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="group bg-[#111111] hover:bg-[#181818] rounded-2xl p-8 shadow-xl hover:shadow-gray-800/50 transition-all duration-300"
        >
          <div className="border-t-2 border-gray-600 w-3/4 mb-6 group-hover:w-full transition-all duration-500"></div>
          <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gray-100">
            {item.title}
          </h3>
          <p className="text-gray-400 text-[15px] leading-relaxed">{item.text}</p>
        </div>
      ))}
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
