import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import hasContent from 'utils/hasContent';
import imgProps from 'utils/imgProps';

import Page from '@/components/builders/Page';
import contentfulClient from '@/providers/contentful';
// import soundCloudGet from '@/providers/soundcloud';


const SITE_HOME = 'https://independendistro.com/';
const DEFAULT_IMG = 'https://images.ctfassets.net/8g9vc93je04m/5Me2rPbzYw9VDLp3CkCsSA/58c6097899c3e9944843e972d010fae9/default_image.png';
const contentful = contentfulClient();

/**
 * Shared context for caching fetched data.
 */
const pageDataCache = {};

/**
 * Fetch and cache page data based on slug.
*/
const fetchPageData = async (slug) => {
    if (!pageDataCache[slug]) {
        const { items: [page] = [] } = await contentful.getEntries({
            content_type: 'page',
            include: 10,
            'fields.slug': slug ? slug : 'home'
        });

        if (!hasContent(page)) {
            //eslint-disable-next-line
            console.error(`Page with slug "${slug}" not found`);

            return {}; 
        }

        const {
            fields = {},
            metadata: {
                tags = []
            } = {},
            sys: {
                createdAt = '',
                updatedAt = '',
                publishedVersion = '',
                revision = '',
                locale = ''
            } = {}
        } = page;

        pageDataCache[slug] = {
            createdAt,
            updatedAt,
            publishedVersion,
            revision,
            locale,
            tags,
            ...fields
        };
    }

    return pageDataCache[slug];
};

/**
 * Generate metadata for the page.
 */
export const generateMetadata = async ({ params }) => {
    const { slug = [] } = await params || {};
    const [useSlug = 'home'] = slug.length > 1 ? [slug.join('/')] : slug;
    const pageData = await fetchPageData(useSlug);

    const {
        pageImage = {},
        metaDescription: description = '',
        metaTitle: title = ''
    } = pageData;

    const {
        imgTitle,
        imgUrl
    } = imgProps(pageImage);

    return {
        title,
        description,
        openGraph: {
            description,
            name: title,
            images: [
                {
                    title: imgTitle || 'Independent Distribution Collective',
                    url: imgUrl || DEFAULT_IMG
                }
            ],
            sameAs: [],
            title,
            url: `${SITE_HOME}${useSlug}`
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [
                { 
                    url: imgUrl,
                    title: imgTitle
                }
            ]
        }
    };
};
/**
 * Render the page component.
 */
const RenderPage = async ({ params }) => {
    const locparams = await params;
    const { slug = [] } = locparams || {};
    const [useSlug = ''] = slug.length > 1 ? [slug.join('/')] : slug;
    const clientCookies = await cookies();
    const { value: sessionToken = '' } = clientCookies.get('sessionToken') || {};

    if (!sessionToken) {
        const headerList = await headers();
        const host = headerList.get('host') || 'localhost:3000';
        const protocol = headerList.get('x-forwarded-proto') || 'http';
        const base = `${protocol}://${host}`;
        const returnUrl = `${base}/${useSlug !== 'home' ? useSlug : ''}`;

        const sessionUrl = new URL(`${base}/api/session`);

        sessionUrl.searchParams.set('redirect', returnUrl);

        return redirect(sessionUrl.toString());
    }

    // Fetch SoundCloud data using session cache
    // const soundCloudData = await soundCloudGet(sessionToken);

    const { ...pageProps } = await fetchPageData(useSlug);

    return (<Page {...pageProps} />);
};

export default RenderPage;
