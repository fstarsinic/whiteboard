import * as tls from 'tls';
import * as url from 'url';

interface CertificateDetails {
  subject: string;
  issuer: string;
  valid_from: string;
  valid_to: string;
  fingerprint: string;
}

function getCertificate(targetUrl: string): Promise<CertificateDetails> {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(targetUrl);
    const options = {
      host: parsedUrl.hostname,
      port: 443,
      servername: parsedUrl.hostname,
    };

    const socket = tls.connect(options as tls.ConnectionOptions, () => {
        const certificate = socket.getPeerCertificate();
        if (!certificate || Object.keys(certificate).length === 0) {
            reject(new Error('The website did not provide a certificate.'));
        } else {
            resolve({
                subject: JSON.stringify(certificate.subject),
                issuer: JSON.stringify(certificate.issuer),
                valid_from: certificate.valid_from,
                valid_to: certificate.valid_to,
                fingerprint: certificate.fingerprint,
            });
        }
        socket.end();
    });

    socket.on('error', (e) => {
      reject(e);
    });
  });
}

// Example usage
getCertificate('https://www.example.com')
  .then((certificate) => {
    console.log('Certificate details:', certificate);
  })
  .catch((error) => {
    console.error('Error retrieving certificate:', error);
  });
