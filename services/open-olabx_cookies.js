const puppeteer = require("puppeteer");
const path = require("path");

// Chrome path - sử dụng biến môi trường hoặc mặc định cho macOS
const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOlabxCookie() {
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

  let cookieValue = null;

  // Lắng nghe response để lấy set-cookie
  page.on("response", async (response) => {
    try {
      const headers = response.headers();
      if (headers["set-cookie"]) {
        cookieValue = headers["set-cookie"];
        console.log("🍪 Found cookie:", cookieValue.substring(0, 50) + "...");
      }
    } catch (error) {
      // Ignore errors
    }
  });

  await page.goto("https://labs.google/fx/vi/tools/whisk/library", {
    waitUntil: "networkidle2",
  });

  console.log("📄 Opened https://labs.google/fx/vi/tools/whisk/library");
  console.log("⏳ Waiting for cookie...");

  // Wait for cookie (max 30 seconds)
  const maxWaitTime = 30000;
  const startTime = Date.now();

  while (!cookieValue && Date.now() - startTime < maxWaitTime) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await new Promise((resolve) => setTimeout(resolve, 8000));
  await browser.close();

  if (!cookieValue) {
    throw new Error("Timeout: Could not get cookie after 30 seconds");
  }

  console.log("✅ Cookie retrieved successfully");

  return {
    success: true,
    cookie: cookieValue,
  };
}

module.exports = { getOlabxCookie };
