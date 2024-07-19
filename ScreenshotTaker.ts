import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer';
import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';

type ScreenshotTakerOptions = {
    viewportWidth?: number;
    viewportHeight?: number;
    timeout?: number;
    maxMemoryUsageMB?: number; // New option to limit max memory usage
};

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
                const request = response.request();

                // Skip reading the buffer for preflight (OPTIONS) requests and redirects
                if (request.method() === 'OPTIONS' || (response.status() >= 300 && response.status() < 400)) {
                    return;
                }

                const buffer = await response.buffer();
                totalBytes += buffer.length;
            } catch (err) {
                console.error('Error reading response buffer:', err.message);
            }
        });

        const startCpuUsage = process.cpuUsage();
        const startTime = performance.now();
        const startMemoryUsage = process.memoryUsage();

        // Navigate to the URL and take a screenshot
        const response = await page.goto(this.url, {
            waitUntil: 'networkidle2',
            timeout: this.options.timeout || 30000,
        });

        if (!response) {
            throw new Error('Failed to load the page.');
        }

        const finalUrl = response.url();
        await page.goto(finalUrl, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: this.filename, fullPage: true });

        const endTime = performance.now();
        const endCpuUsage = process.cpuUsage(startCpuUsage);
        const endMemoryUsage = process.memoryUsage();

        await page.close();

        // Calculate the size of the screenshot file
        const screenshotBuffer = await fs.readFile(this.filename);
        const screenshotSize = screenshotBuffer.length;

        // Calculate the time taken to create the screenshot
        const timeTaken = endTime - startTime;

        // Calculate memory usage difference
        const memoryUsageDiff = {
            rss: (endMemoryUsage.rss - startMemoryUsage.rss) / 1024 / 1024, // Convert to MB
            heapTotal: (endMemoryUsage.heapTotal - startMemoryUsage.heapTotal) / 1024 / 1024,
            heapUsed: (endMemoryUsage.heapUsed - startMemoryUsage.heapUsed) / 1024 / 1024,
            external: (endMemoryUsage.external - startMemoryUsage.external) / 1024 / 1024,
        };

        // Log the metrics
        console.log(`Total network bandwidth used: ${totalBytes} bytes`);
        console.log(`Screenshot size: ${screenshotSize} bytes`);
        console.log(`CPU usage: user ${endCpuUsage.user} µs, system ${endCpuUsage.system} µs`);
        console.log(`Time taken: ${timeTaken.toFixed(2)} ms`);
        console.log(`Memory usage: ${JSON.stringify(memoryUsageDiff)} MB`);

        // Check memory usage limit
        if (this.options.maxMemoryUsageMB && endMemoryUsage.heapUsed / 1024 / 1024 > this.options.maxMemoryUsageMB) {
            throw new Error(`Memory usage exceeded limit of ${this.options.maxMemoryUsageMB} MB`);
        }
    }

    public static async createBrowser(options?: PuppeteerLaunchOptions): Promise<Browser> {
        return await puppeteer.launch(options);
    }
}

// Example usage:
async function main() {
    const url = 'https://www.example.com';
    const filename = 'example.png';
    const browserOptions: PuppeteerLaunchOptions = { headless: true };
    const screenshotOptions: ScreenshotTakerOptions = {
        viewportWidth: 1280,
        viewportHeight: 720,
        timeout: 30000,
        maxMemoryUsageMB: 500, // Limit memory usage to 500 MB
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
