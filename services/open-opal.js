const puppeteer = require("puppeteer");
const path = require("path");

// Chrome path - sử dụng biến môi trường hoặc mặc định cho macOS
const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Proxy config
const PROXY_SERVER = "tnetpx.smitbox.com:18084";
const PROXY_USERNAME = "k23fjgdf56tg";
const PROXY_PASSWORD = "dfjh3233498jfg67d9";

// Mapping: account type -> Chrome profile folder
const PROFILE_MAPPING = {
  "google-opal_1": "chrome-opla-1",
  "google-opal_2": "chrome-opla-2",
  "google-opal_3": "chrome-opla-3",
  "google-opal_4": "chrome-opla-4",
  "google-opal_5": "chrome-opla-5",
  // Fallback cho type cũ
  "google-opal": "opal",
};

async function getOpalToken(type = "google-opal_1") {
  let browser = null;

  // Map type sang Chrome profile folder
  const profileFolder = PROFILE_MAPPING[type] || "chrome-opla-1";
  const chromeDataPath = path.join(__dirname, `../chrome-data/${profileFolder}`);
  console.log(`📂 Chrome data path for ${type}:`, chromeDataPath);

  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    defaultViewport: null,
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--proxy-server=http://${PROXY_SERVER}`,
    ],
    userDataDir: chromeDataPath,
  });

  const page = await browser.newPage();

  // Authenticate proxy
  await page.authenticate({
    username: PROXY_USERNAME,
    password: PROXY_PASSWORD,
  });

  // Ẩn dấu hiệu automation
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
  });

  let bearerToken = null;

  // Bật request interception
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    const headers = request.headers();

    if (headers.authorization && headers.authorization.startsWith("Bearer ")) {
      bearerToken = headers.authorization.replace("Bearer ", "");
      console.log("🎯 Found Bearer token!");
      console.log("URL:", request.url());
    }

    request.continue();
  });

  await page.goto("https://opal.google/", {
    waitUntil: "networkidle2",
  });

  console.log("📄 Opened https://opal.google/");
  console.log("⏳ Waiting for token...");

  // Wait for token (max 60 seconds)
  const maxWaitTime = 60000;
  const startTime = Date.now();

  while (!bearerToken && Date.now() - startTime < maxWaitTime) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await new Promise((resolve) => setTimeout(resolve, 8000));
  await browser.close();

  if (!bearerToken) {
    throw new Error("Timeout: Could not get token after 60 seconds");
  }

  console.log("✅ Token retrieved successfully");

  return {
    success: true,
    token: bearerToken,
    type: type,
  };
}

module.exports = { getOpalToken };
