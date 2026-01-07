const puppeteer = require("puppeteer");
const path = require("path");

// Chrome path - sử dụng biến môi trường hoặc mặc định cho macOS
const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Proxy config
const PROXY_SERVER = "tnetpx.smitbox.com:18081";
const PROXY_USERNAME = "kfjg9845jdf";
const PROXY_PASSWORD = "dfjh398jdf9845j";

// Chrome profiles để rotate khi bị rate limit
const CHROME_PROFILES = [
  "chrome-videos",
  "chrome-videos_2",
  "chrome-videos_3",
  "chrome-videos_4",
  "chrome-videos_5",
];

/**
 * Lấy Olabx token từ Google Labs
 * @param {number} profileIndex - Index của chrome profile (0-4), default 0
 */
async function getOlabxToken(profileIndex = 0) {
  let browser = null;

  // Validate và lấy profile name
  const safeIndex = Math.min(
    Math.max(0, profileIndex),
    CHROME_PROFILES.length - 1
  );
  const profileName = CHROME_PROFILES[safeIndex];

  const chromeDataPath = path.join(__dirname, `../chrome-data/${profileName}`);
  console.log(`📂 Chrome data path (profile ${safeIndex}):`, chromeDataPath);

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
  console.log("browser", browser);
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

  // Lắng nghe request để lấy Bearer token
  page.on("request", async (request) => {
    try {
      const headers = request.headers();
      if (
        headers.authorization &&
        headers.authorization.startsWith("Bearer ")
      ) {
        bearerToken = headers.authorization.replace("Bearer ", "");
        console.log("🎯 Found Bearer token!");
        console.log("URL:", request.url());
      }
    } catch (error) {
      // Ignore errors
    }
  });

  await page.goto("https://labs.google/fx/vi/tools/whisk/library", {
    waitUntil: "networkidle2",
  });

  console.log("📄 Opened https://labs.google/fx/vi/tools/whisk/library");
  console.log("⏳ Waiting for token...");

  // Wait for token (max 220 seconds)
  const maxWaitTime = 220000;
  const startTime = Date.now();

  while (!bearerToken && Date.now() - startTime < maxWaitTime) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await new Promise((resolve) => setTimeout(resolve, 200000));
  await browser.close();

  if (!bearerToken) {
    throw new Error("Timeout: Could not get token after 220 seconds");
  }

  console.log("✅ Token retrieved successfully");

  return {
    success: true,
    token: bearerToken,
    profileIndex: safeIndex,
  };
}

module.exports = { getOlabxToken, CHROME_PROFILES };
