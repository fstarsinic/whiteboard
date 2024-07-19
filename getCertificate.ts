import * as https from 'https';

interface CertificateDetails {
  subject: string;
  issuer: string;
  valid_from: string;
  valid_to: string;
  fingerprint: string;
}

function getCertificate(url: string): Promise<CertificateDetails> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url,
      port: 443,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      const socket = res.socket;
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
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

// Example usage
getCertificate('www.example.com')
  .then((certificate) => {
    console.log('Certificate details:', certificate);
  })
  .catch((error) => {
    console.error('Error retrieving certificate:', error);
  });
