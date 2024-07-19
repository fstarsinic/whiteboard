import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer';
import fs from 'fs-extra';
import { createObjectCsvWriter } from 'csv-writer';
import { performance } from 'perf_hooks';
import crypto from 'crypto';
import { ScreenshotTaker, ScreenshotTakerOptions } from './ScreenshotTaker'; // Assuming ScreenshotTaker is exported from a separate file

const generateRandomFilename = (): string => {
    return crypto.randomBytes(16).toString('hex') + '.png';
};

const writeCsv = async (records: any[], path: string) => {
    const csvWriter = createObjectCsvWriter({
        path,
        header: [
            { id: 'url', title: 'URL' },
            { id: 'filename', title: 'Filename' },
            { id: 'networkBandwidth', title: 'Network Bandwidth (bytes)' },
            { id: 'screenshotSize', title: 'Screenshot Size (bytes)' },
            { id: 'cpuUser', title: 'CPU User (µs)' },
            { id: 'cpuSystem', title: 'CPU System (µs)' },
            { id: 'timeTaken', title: 'Time Taken (ms)' },
            { id: 'memoryRss', title: 'Memory RSS (MB)' },
            { id: 'memoryHeapTotal', title: 'Memory Heap Total (MB)' },
            { id: 'memoryHeapUsed', title: 'Memory Heap Used (MB)' },
            { id: 'memoryExternal', title: 'Memory External (MB)' },
        ]
    });

    await csvWriter.writeRecords(records);
};

const testScreenshotPerformance = async (urls: string[], concurrency: number, options: ScreenshotTakerOptions) => {
    const browserOptions: PuppeteerLaunchOptions = { headless: true };
    const browser = await ScreenshotTaker.createBrowser(browserOptions);

    const statistics: any[] = [];
    const tasks: Promise<void>[] = [];

    for (const url of urls) {
        const filename = generateRandomFilename();
        const screenshotTaker = new ScreenshotTaker(url, filename, browser, options);

        const task = async () => {
            try {
                await screenshotTaker.execute();

                const stats = {
                    url,
                    filename,
                    networkBandwidth: screenshotTaker.getNetworkBandwidth(),
                    screenshotSize: screenshotTaker.getScreenshotSize(),
                    cpuUser: screenshotTaker.getCpuUsage().user,
                    cpuSystem: screenshotTaker.getCpuUsage().system,
                    timeTaken: screenshotTaker.getTimeTaken(),
                    memoryRss: screenshotTaker.getMemoryUsage().rss,
                    memoryHeapTotal: screenshotTaker.getMemoryUsage().heapTotal,
                    memoryHeapUsed: screenshotTaker.getMemoryUsage().heapUsed,
                    memoryExternal: screenshotTaker.getMemoryUsage().external,
                };

                statistics.push(stats);
            } catch (error) {
                console.error(`Error taking screenshot for ${url}:`, error);
            }
        };

        tasks.push(task());

        if (tasks.length >= concurrency) {
            await Promise.all(tasks.splice(0, concurrency));
        }
    }

    await Promise.all(tasks);

    await browser.close();

    await writeCsv(statistics, 'performance_stats.csv');
};

(async () => {
    const urls = [
        'https://www.example.com',
        // Add more URLs to test
    ];
    const concurrency = 5; // Number of concurrent screenshots
    const screenshotOptions: ScreenshotTakerOptions = {
        viewportWidth: 1280,
        viewportHeight: 720,
        timeout: 30000,
        maxMemoryUsageMB: 500, // Limit memory usage to 500 MB
    };

    await testScreenshotPerformance(urls, concurrency, screenshotOptions);
})();
