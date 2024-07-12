import puppeteer from 'puppeteer';

class ScreenshotTaker {
    private url: string;
    private filename: string;

    constructor(url: string, filename: string) {
        this.url = url;
        this.filename = filename;
    }

    public async execute(): Promise<void> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the initial URL, Puppeteer will handle redirects
        const response = await page.goto(this.url, { waitUntil: 'networkidle2' });
        if (response) {
            // Ensure we capture the screenshot of the final URL after any redirects
            const finalUrl = response.url();
            await page.goto(finalUrl, { waitUntil: 'networkidle2' });
            await page.screenshot({ path: this.filename, fullPage: true });

            await browser.close();
        } else {
            throw new Error('Failed to navigate to the URL');
        }
    }   
}

// Example usage:
const url = 'https://www.google.com';
const filename = 'example.png';
const screenshotTaker = new ScreenshotTaker(url, filename);

screenshotTaker.execute().then(() => {
    console.log('Screenshot taken and saved as ' + filename);
}).catch(error => {
    console.error('Error taking screenshot:', error);
});
