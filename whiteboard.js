import fs from 'fs';
import fetch from 'node-fetch';

let k = 0; // Assuming `k` is a global counter for retries, define it outside of the function

async function asnDataLoad(ips: string[]): Promise<void> {
    for (const ipString of ips) {
        const ip = parseInt(ipString);
        for (const service of asn_data['services']) {
            for (const iprange of service[0]) {
                const x = iprange.split("-");
                const start = parseInt(x[0]);
                const end = parseInt(x[1]) + 1;
                if (ip >= start && ip < end) {
                    try {
                        console.log(`now in function for ip in ${ip}`);
                        const dataUrl = `${service[1][0]}autnum/${ip}`;
                        const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36' };
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
                        const response = await fetch(dataUrl, { headers });
                        if (!response.ok) throw new Error('Network response was not ok.');
                        const dataJson = await response.json();
                        fs.writeFileSync(`./raw_asn/${ip}.json`, JSON.stringify(dataJson));
                    } catch (error) {
                        console.error(`failed in ${ip}`);
                        k += 1;
                        if (k < 3) {
                            console.log(`Retrying again for ${ip}`);
                            // Consider how you want to handle retries. Direct recursive calls might not be ideal in async context.
                        }
                    }
                }
            }
        }
    }
}
