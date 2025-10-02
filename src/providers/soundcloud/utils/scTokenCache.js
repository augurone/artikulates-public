import hasContent from '../../../utils/hasContent';

// tokenCache.js
let cachedToken = '';
let tokenExpiration = 0;

const getCachedSCToken = () => {
    // Check if token is still valid
    if (hasContent(cachedToken) && tokenExpiration > Date.now()) {
        return {
            access_token: cachedToken,
            expires_in: tokenExpiration
        };
    }

    return {};
};

const setCachedSCToken = (token, expiresIn) => {
    cachedToken = token;
    tokenExpiration = Date.now() + expiresIn * 1000; // Convert expiresIn to milliseconds
};

export {
    getCachedSCToken,
    setCachedSCToken
};
