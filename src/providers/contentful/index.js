import { createClient } from 'contentful';

const {
    env: {
        CONTENTFUL_SPACE,
        CONTENTFUL_ACCESS_TOKEN
    }
} = process;


const client = createClient({
    space: CONTENTFUL_SPACE,
    environment: 'master',
    accessToken: CONTENTFUL_ACCESS_TOKEN
});

const contentfulClient = (preview = false) => client;

export default contentfulClient;
