const puppeteer = require("puppeteer");
const path = require("path");

// Chrome path - sử dụng biến môi trường hoặc mặc định cho macOS
const getChromePath = () => {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  // Linux
  if (process.platform === "linux") return "/usr/bin/google-chrome";

  // macOS
  if (process.platform === "darwin")
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  // Windows
  if (process.platform === "win32")
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  return "/usr/bin/google-chrome";
};

const CHROME_PATH = getChromePath();

// Proxy config
const PROXY_SERVER = "tnetpx.smitbox.com:18081";
const PROXY_USERNAME = "kfjg9845jdf";
const PROXY_PASSWORD = "dfjh398jdf9845j";

async function getOpalToken(type = "google-opal") {
  let browser = null;

  const chromeDataPath = path.join(__dirname, "../chrome-data/opal");
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
