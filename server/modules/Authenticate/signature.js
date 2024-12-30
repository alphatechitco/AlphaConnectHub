const crypto = require('crypto')

const sharedSecret = 'SharedAccessSignature sr=712bd5fb-2a18-43a5-bd25-e7c8c9974888&sig=AGBPCrMjoQLM%2FhmVLlzXuw%2Fy0bd0CrGfhjPMH5RRYow%3D&skn=reqauth&se=1766973268014';


class AuthenticateSignature {
    constructor () {

    }

    async verifySignature(payload, receievedSignature) {
        const hmac = crypto.createHmac('sha256', sharedSecret);
        const calculatedSignature = hmac.update(payload).digest('hex');
        return calculatedSignature === receievedSignature
    }

}

module.exports = new AuthenticateSignature ()