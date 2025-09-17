require("dotenv").config();
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(name, subject, text, toEmail, stage) {
  try {
    let info = await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      text: `Hey ${name},\n\n${text}`,
    });

    console.log("✅ Email sent:", info.messageId);

    if (toEmail && stage) {
      const { error } = await supabase
        .from("leads")
        .update({ email_stage: stage, updated_at: new Date() })
        .eq("email", toEmail);

      if (error) console.error(" Error updating email_stage:", error);
      else console.log(` Updated ${toEmail} → email_stage = ${stage}`);
    }
  } catch (error) {
    console.error(" Error sending email:", error);
  }
}

function scheduleLeadEmails(name, email, city) {
  const fourDaysLater = new Date();
  fourDaysLater.setDate(fourDaysLater.getDate() + 4);
  const cron4Days = `${fourDaysLater.getMinutes()} ${fourDaysLater.getHours()} ${fourDaysLater.getDate()} ${
    fourDaysLater.getMonth() + 1
  } *`;

  cron.schedule(cron4Days, () => {
    sendMail(
      name,
      "The Secret to Selling Your Home for Top Dollar",
      `Hi ${name},

Thanks for reaching out! Selling your home is one of the biggest financial decisions you’ll make—and the right strategy makes all the difference.

My approach is built on three things:

1. Strategic Pricing - Getting you top dollar without scaring buyers.  
2. Powerful Marketing - Professional photos, video, social ads, and a massive buyer network.  
3. Strong Negotiation - Protecting your equity every step of the way.

The first step is easy: let’s schedule a Seller Strategy Call to talk about your goals and create a plan.

📅 [Book Your Strategy Call]

Talk soon,  
Michael`,
      email,
      "Stage 2"
    );
  });

  const twelveDaysLater = new Date();
  twelveDaysLater.setDate(twelveDaysLater.getDate() + 12);
  const cron12Days = `${twelveDaysLater.getMinutes()} ${twelveDaysLater.getHours()} ${twelveDaysLater.getDate()} ${
    twelveDaysLater.getMonth() + 1
  } *`;

  cron.schedule(cron12Days, () => {
    sendMail(
      name,
      "How to Sell Your Home for More Money", // Subject
      `Hi ${name},

Over the years, I’ve learned that selling successfully comes down to 3 keys:

1. Pricing it Right – Too high and you sit. Too low and you leave money on the table.
2. Presenting it Well – Staging, photos, and small tweaks that add big value.
3. Marketing to the Right Buyers – It’s about exposure to the people most likely to pay top dollar.

This is exactly what I do for my clients.

📅 [Schedule Your Seller Strategy Call] and let’s create your personalized plan.

Talk soon,
Michael`,
      email,

      "Stage 3"
    );
  });

  const twentyDaysLater = new Date();
  twentyDaysLater.setDate(twentyDaysLater.getDate() + 20);
  const cron20Days = `${twentyDaysLater.getMinutes()} ${twentyDaysLater.getHours()} ${twentyDaysLater.getDate()} ${
    twentyDaysLater.getMonth() + 1
  } *`;

  cron.schedule(cron20Days, () => {
    sendMail(
      name,
      "How We Put Your Home in Front of the Right Buyers", // Subject
      `Hi ${name},


Did you know most buyers find their home online first? That’s why marketing matters.

Here’s what I do to make your home stand out:
- Professional photography & video tours.
- Targeted social media and digital ads.
- Direct outreach to my database of ready buyers.

The goal? Maximum exposure to the buyers most likely to pay top dollar.

📅 [Let’s Discuss How I’d Market Your Home]

Best,
Michael`,
      email,
      "Stage 4"
    );
  });

  const twentyeightLater = new Date();
  twentyeightLater.setDate(twentyeightLater.getDate() + 28);
  const cron28Days = `${twentyeightLater.getMinutes()} ${twentyeightLater.getHours()} ${twentyeightLater.getDate()} ${
    twentyeightLater.getMonth() + 1
  } *`;

  cron.schedule(cron28Days, () => {
    sendMail(
      name,
      "Is Now the Best Time to Sell?",
      `Hi ${name},

One of the most common questions I get is: “When is the best time to sell?”

The truth is, timing depends on two things:
- Market Conditions – Buyer demand, inventory, and rates.
- Your Goals – Whether you want speed, top dollar, or flexibility.

I’d be happy to review the numbers for your neighborhood so you can decide if now is the right moment.

📅 [Schedule a Quick Call to Review Timing]

Let’s make sure you sell when it benefits you most.

Best,
Michael`,
      email,
      "Stage 5"
    );
  });

  const thirtysixLater = new Date();
  thirtysixLater.setDate(thirtysixLater.getDate() + 36);
  const cron36Days = `${thirtysixLater.getMinutes()} ${thirtysixLater.getHours()} ${thirtysixLater.getDate()} ${
    thirtysixLater.getMonth() + 1
  } *`;

  cron.schedule(cron36Days, () => {
    sendMail(
      name,
      "Don’t Make These Mistakes When Selling",
      `Hi ${name},

I see it all the time—sellers making costly mistakes.
The most common are:

1. Overpricing their home.
2. Skipping preparation (staging, repairs).
3. Choosing weak marketing.

These mistakes can cost thousands of dollars or lead to sitting on the market.

My role is to help you avoid them and get the strongest possible result.

📅 [Book a Strategy Session Today]

Talk soon,
Michael`,
      email,
      "Stage 6"
    );
  });

  const fourtyfourLater = new Date();
  fourtyfourLater.setDate(fourtyfourLater.getDate() + 44);
  const cron44Days = `${fourtyfourLater.getMinutes()} ${fourtyfourLater.getHours()} ${fourtyfourLater.getDate()} ${
    fourtyfourLater.getMonth() + 1
  } *`;

  cron.schedule(cron44Days, () => {
    sendMail(
      name,
      `Hi ${name},

Here’s a quick story: Jenny wanted to sell their home in Scottsdale.

With the right pricing, staging, and marketing, we generated multiple offers and sold for over asking price in just 20 days.

That’s the power of the right strategy and the right marketing.

I’d love to help you achieve the same success.

📅 [Schedule Your Seller Strategy Call Today]

Best,
Michael`,
      email,
      "Stage 7"
    );
  });

  const fiftytwoLater = new Date();
  fiftytwoLater.setDate(fiftytwoLater.getDate() + 52);
  const cron52Days = `${fiftytwoLater.getMinutes()} ${fiftytwoLater.getHours()} ${fiftytwoLater.getDate()} ${
    fiftytwoLater.getMonth() + 1
  } *`;

  cron.schedule(cron52Days, () => {
    sendMail(
      name,
      "Ready to Cash Out on Your Equity?",
      `Hi ${name},

You’ve built up equity in your home—don’t let the opportunity slip by.

Buyer demand is strong, and homes like yours are still moving quickly.

If you’re even thinking about selling, now is the time to get clarity.

The best next step?
👉 [Book Your Seller Strategy Session Here]

Let’s put a plan together and set you up for success.

Talk soon,
Michael`,
      email,
      "Stage 8"
    );
  });

  const sixtyoLater = new Date();
  sixtyoLater.setDate(sixtyoLater.getDate() + 60);
  const cron60Days = `${sixtyoLater.getMinutes()} ${sixtyoLater.getHours()} ${sixtyoLater.getDate()} ${
    sixtyoLater.getMonth() + 1
  } *`;


}

 module.exports = { sendMail, scheduleLeadEmails };

 
// require("dotenv").config();
// const nodemailer = require("nodemailer");
// const cron = require("node-cron");
// const supabase = require('./db/supabaseClient');

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// async function sendMail(name, subject, text, toEmail, stage) {
//   try {
//     let info = await transporter.sendMail({
//       from: `<${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject,
//       text: `Hey ${name},\n\n${text}`,
//     });

//     console.log("✅ Email sent:", info.messageId);

//     if (toEmail && stage) {
//       const { error } = await supabase
//         .from("leads")
//         .update({ email_stage: stage, updated_at: new Date() })
//         .eq("email", toEmail);

//       if (error) console.error(" Error updating email_stage:", error);
//       else console.log(` Updated ${toEmail} → email_stage = ${stage}`);
//     }
//   } catch (error) {
//     console.error(" Error sending email:", error);
//   }
// }

// function scheduleLeadEmails(name, email, city) {
//   const fourDaysLater = new Date();
//   fourDaysLater.setMinutes(fourDaysLater.getMinutes() + 1);
//   const cron4Days = `${fourDaysLater.getMinutes()} ${fourDaysLater.getHours()} ${fourDaysLater.getDate()} ${fourDaysLater.getMonth() + 1} *`;

//   cron.schedule(cron4Days, () => {
//     sendMail(
//       name,
//       "Your Home Search Simplified",
//       `Thanks again for reaching out! Buying a home can be an overwhelming journey,
// but with the right plan it becomes simple and exciting.

// We’ll help you find the perfect home in ${city}.

// Talk soon,
// Michael K`,
//       email,
//       "Stage 2"
//     );
//   });

//   const twelveDaysLater = new Date();
//   twelveDaysLater.setMinutes(twelveDaysLater.getMinutes() + 2);
//   const cron12Days = `${twelveDaysLater.getMinutes()} ${twelveDaysLater.getHours()} ${twelveDaysLater.getDate()} ${twelveDaysLater.getMonth() + 1} *`;

//   cron.schedule(cron12Days, () => {
//     sendMail(
//       name,
//       "What's Really Happening in Real Estate",
//       `This week, the market in ${city} is changing in important ways:

// Inventory is [low/high], meaning competition is [strong/weak].

// Average home prices are [trending up/down].

// The best homes are selling in [X] days.

// When you’re buying, the difference between success and frustration often comes down to timing and preparation.

// That’s why I offer my clients a personalized strategy session—you know exactly how to win in today’s market.

//  [Book Your Strategy Call]

// Let’s put a plan together before your dream home hits the market.

// Best,
// Michael`,
//       email,
//       "Stage 3"
//     );
//   });

//   const twentyDaysLater = new Date();
//   twentyDaysLater.setMinutes(twentyDaysLater.getMinutes() + 4);
//   const cron20Days = `${twentyDaysLater.getMinutes()} ${twentyDaysLater.getHours()} ${twentyDaysLater.getDate()} ${twentyDaysLater.getMonth() + 1} *`;

//   cron.schedule(cron20Days, () => {
//     sendMail(
//       name,
//       "The #1 Step Most Buyers Skip (Don’t!)",
//       `One of the biggest mistakes buyers make is waiting to get pre-approved. Without it, you could:

// Miss out on the home you love.

// Overestimate what you can afford.

// Be taken less seriously by sellers.

// The good news? Pre-approval is simple. I work with trusted lenders who make the process smooth and stress-free.

// If you don’t already have someone, I’d be happy to connect you with the best.

// 💡 Let’s Chat About Financing Options!

// Being prepared now means you’ll be ready when the right home comes along.

// Talk soon,
// Michael`,
//       email,
//       "Stage 4"
//     );
//   });

//   const twentyeightLater = new Date();
//   twentyeightLater.setMinutes(twentyeightLater.getMinutes() + 5);
//   const cron28Days = `${twentyeightLater.getMinutes()} ${twentyeightLater.getHours()} ${twentyeightLater.getDate()} ${twentyeightLater.getMonth() + 1} *`;

//   cron.schedule(cron28Days, () => {
//     sendMail(
//       name,
//       "How to Find Homes BEFORE They Hit Zillow",
//       `Here’s something most buyers don’t know: not all homes are online.

// Some are sold before they ever get listed on Zillow, Redfin, or Realtor.com.

// Because of my network and MLS access, I can connect my clients with homes that are coming soon but not yet public.

// A few off-market opportunities.

// Fit their unique needs perfectly.

// This can be the difference between winning your dream home or missing it.

//  [Schedule a Quick Call to Get Access]

// Let’s talk about how I can give you the edge in today’s market.

// Best,
// Michael`,
//       email,
//       "Stage 5"
//     );
//   });

//   const thirtysixLater = new Date();
//   thirtysixLater.setMinutes(thirtysixLater.getMinutes() + 6);
//   const cron36Days = `${thirtysixLater.getMinutes()} ${thirtysixLater.getHours()} ${thirtysixLater.getDate()} ${thirtysixLater.getMonth() + 1} *`;

//   cron.schedule(cron36Days, () => {
//     sendMail(
//       name,
//       "Don’t Let These Mistakes Cost You Thousands",
//       `When buying a home, small mistakes can cost you big.

// Here are the 3 most common I see:

// Waiting too long to make an offer.

// Skipping pre-approval before house hunting.

// Waiving important inspections without guidance.

// My job is to help you avoid these mistakes and protect your money every step of the way.

// The best way to do that is by creating a plan before you fall in love with a home.

//  [Book Your Buyer Strategy Call Today]

// Talk soon,
// Michael`,
//       email,
//       "Stage 6"
//     );
//   });

//   const fourtyfourLater = new Date();
//   fourtyfourLater.setMinutes(fourtyfourLater.getMinutes() + 7);
//   const cron44Days = `${fourtyfourLater.getMinutes()} ${fourtyfourLater.getHours()} ${fourtyfourLater.getDate()} ${fourtyfourLater.getMonth() + 1} *`;

//   cron.schedule(cron44Days, () => {
//     sendMail(
//       name,
//       "I’ll Help You Find the Perfect Fit",
//       `Every buyer has a unique list of must-haves. Maybe for you it’s a community pool, extra office space, or a quick commute.

// I’d love to set up a customized MLS search for you. Unlike Zillow or Redfin, this will send you listings that actually match your criteria—often before they’re public.

// Send me your must-haves, or better yet:
//  [Schedule a Quick Call] and we’ll build your perfect search together.

// Let’s find the home that checks every box.

// Best,
// Michael`,
//       email,
//       "Stage 7"
//     );
//   });

//   const fiftytwoLater = new Date();
//   fiftytwoLater.setMinutes(fiftytwoLater.getMinutes() + 8);
//   const cron52Days = `${fiftytwoLater.getMinutes()} ${fiftytwoLater.getHours()} ${fiftytwoLater.getDate()} ${fiftytwoLater.getMonth() + 1} *`;

//   cron.schedule(cron52Days, () => {
//     sendMail(
//       name,
//       "How We Helped Jamie and Randall Buy Their Dream Home",
//       `I want to share a quick story about Jamie and Randall. They were looking for a single-family home in Downtown Gilbert. Like many buyers, they were feeling overwhelmed and unsure how to compete.

// Together, we created a clear strategy, found the perfect home, and negotiated an amazing deal. Today, they’re happily settled in a place they love.

// I’d love to help you have the same success.

//  [Book Your Buyer Strategy Call Here]

// Let’s make your story the next success.

// Talk soon,
// Michael`,
//       email,
//       "Stage 8"
//     );
//   });

//   const sixtyoLater = new Date();
//   sixtyoLater.setMinutes(sixtyoLater.getMinutes() + 9);
//   const cron60Days = `${sixtyoLater.getMinutes()} ${sixtyoLater.getHours()} ${sixtyoLater.getDate()} ${sixtyoLater.getMonth() + 1} *`;

//   cron.schedule(cron60Days, () => {
//     sendMail(
//       name,
//       "Ready to Find Your Home? Let’s Get Started",
//       `Over the past few weeks, I’ve shared insights to help you succeed, but the truth is, the magic happens once we build a clear, personalized plan.

// The market moves quickly—waiting could mean missing the perfect home.

// The best next step?
//  [Book Your Buyer Strategy Session Now]

// Let’s put your plan in place and get you on the path to your dream home.

// Best,
// Michael`,
//       email,
//       "Stage 9"
//     );
//   });
// }

// module.exports = { sendMail, scheduleLeadEmails };
