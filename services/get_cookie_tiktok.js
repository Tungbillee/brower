const puppeteer = require("puppeteer");
const path = require("path");

// Chrome path - sử dụng biến môi trường hoặc mặc định cho macOS
const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getCookieTiktok() {
  return new Promise(async (resolve, reject) => {
    let browser;
    let isResolved = false;

    try {
      const chromeDataPath = path.join(__dirname, "../chrome-data/tiktok");
      console.log("📂 Chrome data path:", chromeDataPath);

      browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: false,
        defaultViewport: null,
        args: [
          "--start-maximized",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
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

      // Enable request interception
      await page.setRequestInterception(true);

      page.on("request", (request) => {
        request.continue();
      });

      page.on("response", async (response) => {
        if (isResolved) return;

        const url = response.url();
        if (url.includes("tiktok/popup/dispatch/v1")) {
          console.log("🎯 Found target URL:", url);
          try {
            const request = response.request();
            const headers = request.headers();
            const cookies = headers["cookie"] || "";

            // Extract device_id from URL query parameters
            const urlObj = new URL(url);
            const deviceId = urlObj.searchParams.get("device_id");

            if (deviceId && cookies) {
              isResolved = true;
              await browser.close();

              resolve({
                device_id: deviceId,
                cookie: cookies,
              });
            }
          } catch (error) {
            console.error("Error extracting data:", error.message);
          }
        }
      });

      await page.goto("https://www.tiktok.com/", { waitUntil: "networkidle2" });

      // Wait for cookie (max 60 seconds)
      const maxWaitTime = 60000;
      const startTime = Date.now();

      while (!isResolved && Date.now() - startTime < maxWaitTime) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (!isResolved) {
        isResolved = true;
        await browser.close();
        reject(
          new Error("Timeout: Could not find cookie data after 60 seconds")
        );
      }
    } catch (error) {
      if (isResolved) return;
      if (browser) await browser.close();
      reject(error);
    }
  });
}

module.exports = { getCookieTiktok };
