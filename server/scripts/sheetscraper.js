const axios = require("axios");
const cheerio = require("cheerio");
const Job = require("../models/Job");

const TARGET_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Zm0OpfWE-vdqdkZ0JSxq8Ek3RgsZAeay/htmlview";

const scrapeSheetLinks = async () => {
  try {
    console.log("📂 [SHEET] Fetching target links from spreadsheet...");
    const { data } = await axios.get(TARGET_SHEET_URL);
    const $ = cheerio.load(data);

    const links = [];
    // This finds every link inside the Google Sheet table cells
    $("td a").each((i, el) => {
      const url = $(el).attr("href");
      if (url && url.includes("http")) {
        links.push(url);
      }
    });

    console.log(`✅ [SHEET] Extracted ${links.length} target URLs.`);

    // In a real scenario, you'd now loop through these 'links'
    // and call specific fetchers for Greenhouse, Lever, etc.
    return links;
  } catch (err) {
    console.error(
      "❌ [SHEET] Failed to read spreadsheet. Using backup internal list.",
    );
    // Return a hardcoded backup list of your top companies if the sheet fails
    return [
      "https://boards.greenhouse.io/razorpay",
      "https://jobs.lever.co/binance",
    ];
  }
};

module.exports = { scrapeSheetLinks };
