import layoutConfig from 'contentful-layout';
import Image from 'next/image';
import React from 'react';
import entriesByContentType from 'utils/entriesByContentType';
import entriesByTag from 'utils/entriesByTag';
import hasContent from 'utils/hasContent';
import typogStr from 'utils/typographyValues';


import RenderComponents from '../RenderComponents';
import RichTextRenderer from '../RichTextRenderer';

import Asset from '@/components/atomic/Asset';
import LayoutComponent from '@/components/builders/LayoutComponent';

/*
    Reusable Block:
    Used to process entries when present in case.
*/
const ChildComponents = ({ entries = [], collection = {}, ...otherSettings }) => {
    if (!entries.length) return '';

    return (
        <>
            {entries.map(({ 
                fields = {}, 
                sys: { 
                    contentType: {
                        sys: {
                            id = 'pageComponent'
                        } = {}
                    }
                } = {}
            } = {}, i) => {
                return (<RenderComponents
                    key={i}
                    contentType={id}
                    oddEven={i % 2 === 0 ? 'odd' : 'even'}
                    { ...(hasContent(collection) && { collection }) }
                    { ...fields }
                    { ...otherSettings } />);
            })}
        </>
    );
};
/*
    Reusable Block:
    These items, or some combination of them, can appear under different conditions
*/
const Gutz = ({
    assets = [],
    collection = {},
    inheritedLayout = {},
    label = '',
    entries = [],
    linkLayout = {},
    priority = '',
    richText = {},
    target = '',
    typography = {},
    url = ''
}) => {
    const { applyToChildren, ...childTypo } = typography;
    const childTypeSetting = applyToChildren ? typogStr(childTypo) : '';

    return (
        <>
            {(hasContent(richText))&& 
                <RichTextRenderer
                    key={`text-${label}`}
                    modifiers={layoutConfig(inheritedLayout)}
                    richText={richText}
                    {...(hasContent( typography) && !applyToChildren && { typography })} />
            }
            {!!(assets.length) &&
            assets.map(({ ...asset }, i) => (<Asset key={i} layout={inheritedLayout} {...(priority && { priority })} {...asset} />))}
            {!!(entries.length) && 
            <ChildComponents 
                {...(hasContent(collection) && { collection })}
                {...(childTypeSetting && { typeClass: childTypeSetting })} 
                entries={entries} />
            }
            {((url) && 
            <a 
                href={url}
                className={layoutConfig(linkLayout)}
                key={`link-${label}`}
                target={target}
                title={label}>
            </a>)}
        </>
    );
};

const PageComponent = ({
    assets = [],
    layoutConfig: layout = {},
    entries = [],
    linkWrap: {
        fields: {
            label,
            url,
            target,
            layoutConfig: linkLayout,
            linkWrap = false
        } = {}
    } = {},
    richText = {},
    semanticDomElement = 'div',
    ...props
}) => {
    const {
        settings: {
            collection: {
                type: collectionType = '',
                enableRiverflow = false
            } = {},
            images: {
                priority = false
            } = {}
        } = {} 
    } = props;
    const {
        fields: { 
            customizationData: {
                typography = {}
            } = {} 
        } = {}
    } = layout;
    const [abstractLayout = {}] = entriesByTag(entries, 'collectionLayoutAbstract');
    const [abstractLayoutImg = {}] = entriesByTag(entries, 'collectionLayoutAbstractImg');
    const [{
        fields: {
            customizationData: {
                typography: abstractTypography
            } = {}
        } = {}
    } = {}] = entriesByTag(entries, 'collectionLayoutAbstractTxt');
    const componentEntries = entriesByContentType(entries, 'pageComponent');
    const componentEntries2 = entriesByContentType(entries, 'component');
    const pageEntries = entriesByContentType(entries, 'page');
    const components = [...componentEntries, ...componentEntries2, ...pageEntries];

    // This makes the assumption that if there is a linkwrap and assets,
    // that only one asset is being processed as an image. 
    // To treat an image otherwise make a page component.
    if (linkWrap && assets.length) {
        const [asset] = assets;
        return (
            <a 
                key={`link-${label}`}
                href={url}
                target={target}
                title={label}
                className={`${layoutConfig(linkLayout)} ${typogStr(typography)}`.trim()}>
                <Asset
                    className='cursor-pointer'
                    layout={layout}
                    {...asset}
                    {...(priority && { priority })} />
            </a>
        );
    }
    
    // Drop Gutz into calling Compnent, and apply layout accoringly
    if (semanticDomElement === 'unwrap') return (
        <Gutz
            key={`guts-${Date.now() * Math.random()}`}
            inheritedLayout={layout}
            priority={priority}
            richText={richText}
            typography={typography}
            {...(!!(assets.length) && { assets })}
            {...(!!(components.length) && { entries: components })}
            {...((url && !linkWrap)  && { url, linkLayout, target, label })} />
        
    );

    // Wraps Gutz in a Layout Container. 
    return (
        <LayoutComponent as={semanticDomElement} layoutConfig={layout} {...props}>
            <Gutz
                priority={priority}
                richText={richText}
                typography={typography}
                {...(!!(assets.length) && { assets })}
                {...(!!(components.length) && { entries: components })}
                {...(collectionType && 
                {
                    collection: {
                        collectionType,
                        enableRiverflow,
                        layouts: {
                            abstract: layoutConfig(abstractLayout),
                            image: layoutConfig(abstractLayoutImg),
                            text: abstractTypography     
                        }
                    } 
                })}
                {...((url && !linkWrap)  && { url, linkLayout, target, label })} />
        </LayoutComponent>
    );
};

export default PageComponent;
