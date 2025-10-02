import parseTags from './utils/parseTags';
import { getCachedSCToken, setCachedSCToken } from './utils/scTokenCache';

const {
    env: {
        SOUNDCLOUD_CLIENT_ID = '',
        SOUNDCLOUD_CLIENT_SECRET = '',
        SOUNDCLOUD_CLIENT_NAME = ''
    } = {}
} = process;
const limit = 200;
const sessionCache = {};

const tokenRequest = async () => {
    const { access_token, expires_in } = getCachedSCToken();

    if (access_token && expires_in >= Date.now()) return access_token; // Fixed: was Date.mow()

    try {
        // Fetch the OAuth2 token
        const tokenResponse = await fetch(
            'https://api.soundcloud.com/oauth2/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: SOUNDCLOUD_CLIENT_ID,
                    client_secret: SOUNDCLOUD_CLIENT_SECRET,
                    grant_type: 'client_credentials'
                })
            }
        );

        if (!tokenResponse.ok) {
            throw new Error('Failed to fetch access token');
        }

        const { access_token, expires_in } = await tokenResponse.json();

        setCachedSCToken(access_token, expires_in);

        return { access_token, expires_in: Date.now() + expires_in * 1000 };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('token error stack', error);

        throw Error(`Token Request Failed: ${error.message}`);
    }
};

const userRequest = async (token) => {
    try {
        const userResponse = await fetch(
            `https://api.soundcloud.com/users?q=${SOUNDCLOUD_CLIENT_NAME}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        if (!userResponse.ok) throw Error('Falied to GET user');

        const [{ id: userId } = {}] = await userResponse.json() || [];


        if (!userId) throw Error('Not a valid USER Request');

        return userId;
    } catch(error) {
        //eslint-disable-next-line no-console
        console.error(error);
        
        throw new Error(`Failed to get user: ${error.message}`);
    }
};

const soundCloudGet = async (sessionToken) => {
    const {
        [sessionToken]: {
            tracks: sessionTracks = [],
            expiresIn: sessionExpiry = 0
        } = {}
    } = sessionCache;

    if (sessionTracks.length && (sessionExpiry >= Date.now())) {
        // eslint-disable-next-line no-console
        console.log('cache', sessionTracks.length);
        return sessionTracks;
    }

    if (!SOUNDCLOUD_CLIENT_ID || !SOUNDCLOUD_CLIENT_SECRET || !SOUNDCLOUD_CLIENT_NAME) throw Error('Setup your secrets');

    // Local Cache for building Session Cache
    let trackCache = [];

    try {
        const { access_token: token = '', expires_in = '' } = await tokenRequest();

        const userId = await userRequest(token);

        // Now to tracks.
        const baseRequest = `https://api.soundcloud.com/users/${userId}/tracks?linked_partitioning=true&limit=${limit}`;

        // Use the token to make an authenticated request to the SoundCloud API
        const tracksBuilder = async (url) => {
            const getTracks = await fetch(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!getTracks.ok) {
                throw new Error('Failed to fetch tracks');
            }

            const {
                collection = [],
                next_href = ''
            } = await getTracks.json();

            trackCache = [...trackCache, ...collection];

            if (next_href) await tracksBuilder(next_href);

            return trackCache;
        };
        const tracks = await tracksBuilder(baseRequest);
        const modTracks = tracks.reduce((list, {
            access,
            tag_list,
            user,
            ...trackData
        }) => { 
            if (access !== 'playable') return list;

            return [
                ...list,
                {
                    ...trackData,
                    tag_list: parseTags(tag_list)
                }
            ];
        }, []);

        sessionCache[sessionToken] = { tracks: modTracks, expiresIn: expires_in };

        return modTracks;
    } catch (error) {
        return { error: error.message };
    }
};

export default soundCloudGet;
