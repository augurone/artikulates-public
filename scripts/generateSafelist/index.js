import fs from 'fs';

import { createClient } from 'contentful';
import layoutConfig from 'contentful-layout';
import dotenv from 'dotenv';

import bgStyles from '../../src/utils/bgStyles.js';
import typogStr from '../../src/utils/typographyValues.js';

dotenv.config({ path: '.env.local' });

const others = [];

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

const fetchLayoutData = async () => {
    const layouts = await client.getEntries({
        content_type: 'layout',
        include: 10
    });
    
    return layouts;
};

const fetchBgData = async () => {
    const backgrounds = await client.getEntries({
        content_type: 'styleBackground',
        include: 10
    });

    return backgrounds;
};

const generateSafelist = async() => {
    const { items = [] } = await fetchLayoutData();
    const { items: backgrounds = [] } = await fetchBgData();
    const safeString = items.reduce((str, item) => {
        const {
            fields: {
                customizationData: {
                    typography = {}
                } = {}
            } = {}
        } = item;
        const layoutstr = layoutConfig(item);
        const textstr = typogStr(typography);

        if (!layoutstr && !textstr) return str; 
        
        if (layoutstr && textstr) return `${str} ${layoutstr} ${textstr}`.replace(/^\s/, '').trim();

        if (layoutstr) return `${str} ${layoutstr}`.replace(/^\s/, '').trim();

        return `${str} ${textstr}`.replace(/^\s/, '').trim();

    }, '').split(' ').filter(val => val);

    const bgsetting = backgrounds.flatMap((background) => {
        const { bgAttrs  = '' } = bgStyles([background]);

        return bgAttrs.split(' ');
    });

    const sorter = (arr = []) => arr.sort((a, b) => {
        if (a < b) return -1;

        if (a > b) return 1;

        return 0;
    });

    const twNames = new Set(sorter([...safeString, ...bgsetting, ...others]));

    // Return simple newline-separated classes for Tailwind v4 CSS import
    return [...Array.from(twNames)].join('\n');
};

const safelist = await generateSafelist();

fs.writeFileSync('./src/styles/safelist.txt', safelist);

