const puppeteer = require("puppeteer");
const path = require("path");

// Chrome path - sử dụng biến môi trường hoặc mặc định cho macOS
const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOlabxToken() {
  let browser = null;

  const chromeDataPath = path.join(__dirname, "../chrome-data/chrome-videos");
  console.log("📂 Chrome data path:", chromeDataPath);

  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    defaultViewport: null,
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
    userDataDir: chromeDataPath,
  });

  const page = await browser.newPage();

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
  await new Promise((resolve) => setTimeout(resolve, 8000));
  await browser.close();

  if (!bearerToken) {
    throw new Error("Timeout: Could not get token after 220 seconds");
  }

  console.log("✅ Token retrieved successfully");

  return {
    success: true,
    token: bearerToken,
  };
}

module.exports = { getOlabxToken };
