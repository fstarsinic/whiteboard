import puppeteer, { Browser, LaunchOptions } from 'puppeteer';
import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';

interface ScreenshotTakerOptions {
    headless?: boolean;
    viewportWidth?: number;
    viewportHeight?: number;
    timeout?: number;
}

class ScreenshotTaker {
    private url: string;
    private filename: string;
    private browser: Browser;
    private options: ScreenshotTakerOptions;

    constructor(url: string, filename: string, browser: Browser, options?: ScreenshotTakerOptions) {
        this.url = url;
        this.filename = filename;
        this.browser = browser;
        this.options = options || {};
    }

    public async execute(): Promise<void> {
        const page = await this.browser.newPage();

        if (this.options.viewportWidth && this.options.viewportHeight) {
            await page.setViewport({
                width: this.options.viewportWidth,
                height: this.options.viewportHeight,
            });
        }

        let totalBytes = 0;

        // Track network requests and responses
        page.on('response', async response => {
            try {
                const buffer = await response.buffer();
                totalBytes += buffer.length;
            } catch (err) {
                console.error('Error reading response buffer:', err);
            }
        });

        const startCpuUsage = process.cpuUsage();
        const startTime = performance.now();

        // Navigate to the URL and take a screenshot
        const response = await page.goto(this.url, {
            waitUntil: 'networkidle2',
            timeout: this.options.timeout || 30000,
        });
        const finalUrl = response.url();
        await page.goto(finalUrl, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: this.filename, fullPage: true });

        const endTime = performance.now();
        const endCpuUsage = process.cpuUsage(startCpuUsage);

        await page.close();

        // Calculate the size of the screenshot file
        const screenshotBuffer = await fs.readFile(this.filename);
        const screenshotSize = screenshotBuffer.length;

        // Calculate the time taken to create the screenshot
        const timeTaken = endTime - startTime;

        // Log the metrics
        console.log(`Total network bandwidth used: ${totalBytes} bytes`);
        console.log(`Screenshot size: ${screenshotSize} bytes`);
        console.log(`CPU usage: user ${endCpuUsage.user} µs, system ${endCpuUsage.system} µs`);
        console.log(`Time taken: ${timeTaken.toFixed(2)} ms`);
    }

    public static async createBrowser(options?: LaunchOptions): Promise<Browser> {
        return await puppeteer.launch(options);
    }
}

// Example usage:
async function main() {
    const url = 'https://www.example.com';
    const filename = 'example.png';
    const browserOptions = { headless: true };
    const screenshotOptions: ScreenshotTakerOptions = {
        viewportWidth: 1280,
        viewportHeight: 720,
        timeout: 30000,
    };

    const browser = await ScreenshotTaker.createBrowser(browserOptions);

    const screenshotTaker = new ScreenshotTaker(url, filename, browser, screenshotOptions);

    try {
        await screenshotTaker.execute();
        console.log('Screenshot taken and saved as ' + filename);
    } catch (error) {
        console.error('Error taking screenshot:', error);
    } finally {
        await browser.close();
    }
}

main().catch(console.error);
