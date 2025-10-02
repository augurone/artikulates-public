import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import React from 'react';
import hasContent from 'utils/hasContent';
import imgProps from 'utils/imgProps';

import Asset from '@/components/atomic/Asset';
import RenderComponents from '@/components/builders/RenderComponents';


const cleanStr = (str = '') => str.replace(/^\s+, ''/).replace(/\s{2,}/,' ').trim(); 
// FontAwesome Free Solid Icons
library.add(fas);
// FontAwesome Free Brand Icons
library.add(fab);

const processStrings = (text = '') => {
    const [hasIcon] = text.match(/\[icon name=".+"\]/g) || [];
    const brText = /\n/g.test(text);
    
    if (!hasIcon && !brText) return text;

    return (
        text.split('\n').flatMap((line = '', lineIndex) => {
            const parsedLine = line.split('] ').map((part = '') => {
                if (/\[icon name=".+"/.test(part)) {
                    const iconNamePrep = hasIcon.replace('[icon name="', '').replace('"]','');
                    const [faTypePre = 'fas', iconName] = iconNamePrep.split(/\s(.*)/s);        
                    const [iconSimpleName] = iconName.split(' ');
    
                    return (<FontAwesomeIcon key={`icon-${iconSimpleName}`} icon={{ prefix: faTypePre, iconName: iconSimpleName.replace(`fa-`,'') }} className={`${iconNamePrep}`} />);
                }
    
                return part;
            });

            return lineIndex === 0 ? parsedLine : [<br key={`br-${lineIndex}`} />, ...parsedLine];
        })
    );
};

const RichTextRenderer = ({
    modifiers = '',
    richText,
    typography: {
        heading1Alignment = '',
        heading1Color = '',
        heading1Font = '',
        heading1Whitespace = '',
        heading2Alignment = '',
        heading2Color = '',
        heading2Font = '',
        heading2Whitespace = '',
        heading3Alignment = '',
        heading3Color = '',
        heading3Font = '',
        heading3Whitespace = '',
        heading4Alignment = '',
        heading4Color = '',
        heading4Font = '',
        heading4Whitespace = '',
        heading5Alignment = '',
        heading5Color = '',
        heading5Font = '',
        heading5Whitespace = '',
        heading6Alignment = '',
        heading6Color = '',
        heading6Font = '',
        heading6Whitespace = '',
        paragraphAlignment = '',
        paragraphColor = '',
        paragraphFont = '',
        paragraphWhitespace = '',
        linkAlignment = '',
        linkColor = '',
        linkFont = '',
        linkWhitespace = '',
        ulClass = '',
        liAlignment = '',
        liColor = '',
        liFont = '',
        liWhitespace = '',
        marksBoldAlignment = '',
        marksBoldColor = 'text-current',
        marksBoldFont = 'font-extrabold',
        marksBoldWhitespace = '',
        marksCodeAlignment = '',
        marksCodeColor = 'text-current',
        marksCodeFont = 'font-light',
        marksCodeWhitespace = '',
        unwrapTextNodes = false
    } = {}
}) => {
    const options = {
        renderText: text => processStrings(text),
        renderNode: {
            [BLOCKS.HEADING_1]: (node, children) => {
                const buildStyle = [heading1Font, heading1Alignment, heading1Color, heading1Whitespace, modifiers].join(' ').trim();
                
                return (<h1 {...(buildStyle && { className: buildStyle })}>{children}</h1>);
            },
            [BLOCKS.HEADING_2]: (node, children) => {
                const buildStyle = [heading2Font, heading2Alignment, heading2Color, heading2Whitespace, modifiers].join(' ').trim();
                
                return (<h2 {...(buildStyle && { className: buildStyle })}>{children}</h2>);
            },
            [BLOCKS.HEADING_3]: (node, children) => {
                const buildStyle = [heading3Font, heading3Alignment, heading3Color, heading3Whitespace, modifiers].join(' ').trim();

                return (<h3 {...(buildStyle && { className: buildStyle })}>{children}</h3>);
            },
            [BLOCKS.HEADING_4]: (node, children) => {
                const buildStyle = [heading4Font, heading4Alignment, heading4Color, heading4Whitespace, modifiers].join(' ').trim();

                return (<h4 {...(buildStyle &&{ className: buildStyle })}>{children}</h4>);
            },
            [BLOCKS.HEADING_5]: (node, children) => {
                const buildStyle = [heading5Font, heading5Alignment, heading5Color, heading5Whitespace, modifiers].join(' ').trim();

                return (<h5 {...(buildStyle && { className: buildStyle })}>{children}</h5>);
            },
            [BLOCKS.HEADING_6]: (node, children) => {
                const buildStyle = [heading6Font, heading6Alignment, heading6Color, heading6Whitespace, modifiers].join(' ').trim();

                return (<h6 {...(buildStyle && { className: buildStyle })}>{children}</h6>);
            },
            [BLOCKS.PARAGRAPH]: (node, children = []) => {    
                const cleanChidlren = children.filter(child => hasContent(child));

                if (!cleanChidlren.length) return '';

                const buildStyle = [paragraphFont, paragraphAlignment, paragraphColor, paragraphWhitespace, modifiers].join(' ').trim();


                return (<p {...(buildStyle && { className: buildStyle })}>{cleanChidlren}</p>);
            },
            [BLOCKS.UL_LIST]: (node, children) => {
                return (<ul {...((ulClass || modifiers) && { className: `${ulClass} ${modifiers}`.trim() })}>{children}</ul>);
            },
            [BLOCKS.LIST_ITEM]: (node, children) => {
                const buildStyle = `${liAlignment} ${liColor} ${liFont} ${liWhitespace}`.trim();

                return (<li {...(buildStyle && { className: buildStyle })}>{children}</li>);
            },
            [BLOCKS.EMBEDDED_ENTRY]: ({
                data: {
                    target: { fields: data = {} } =  {}
                } = {}
            }, children) => {
                return (<RenderComponents contentType='pageComponent' {...data} />);
            },
            [BLOCKS.EMBEDDED_ASSET]: ({
                data: {
                    target = {}
                } = {}
            }, children) => {
                
                return (<Asset {...target} />);
            },
            [INLINES.HYPERLINK]: (node, children) => {
                const buildStyle = [linkAlignment, linkColor, linkFont, linkWhitespace].join(' ').trim();
                const {
                    content : [{ value = '' }] = [],
                    data: {
                        uri = ''
                    } = {}
                } = node;

                return (<a className={buildStyle} href={uri} title={value}>{children}</a>);
            },
            [INLINES.EMBEDDED_ENTRY]:  ({
                data: {
                    target: { fields: data = {} } =  {}
                } = {}
            }) => {
                return (<RenderComponents {...data} />);
            }
        },
        renderMark: {
            [MARKS.BOLD]: (node) => {
                const buildStyle =  [marksBoldFont, marksBoldColor, marksBoldWhitespace, marksBoldAlignment].join(' ').trim();

                return (<strong {...(buildStyle &&{ className: buildStyle })}>{node}</strong>);
            },
            [MARKS.CODE]: (node) => {
                const buildStyle =  [marksCodeFont, marksCodeColor, marksCodeWhitespace, marksCodeAlignment].join(' ').trim();

                return (<span {...(buildStyle &&{ className: buildStyle })}>{node}</span>);
            }
        }
    };

    if (unwrapTextNodes && hasContent(richText)) {
        const { content = [] } = richText || {};

        if (!content.length) return '';

        return content.flatMap(({
            content: itemContent = [],
            data: {
                target = {}
            } = {}
        } = {}) => {
            const {
                height,
                imgDesc,
                imgTitle,
                imgUrl,
                width
            } = imgProps(target);
            
            const processNodes = (node = []) => node.map(({
                value = '',
                data: {
                    uri: nodeUrl = ''
                } = {}, 
                content: nodeContent = []
            }) => {
                const targ = nodeUrl && /https?/.test(nodeUrl) ? '_blank' : '_self';
                
                if (value && nodeUrl) return (<a key={`link-${value}`} target={targ} href={nodeUrl} title={nodeUrl}>{processStrings(value)}</a>);

                if (value && !nodeUrl) return processStrings(value);

                if (nodeContent.length && nodeUrl) return (<a key={`link-${nodeUrl}`} target={targ} href={nodeUrl} title={nodeUrl}>{processNodes(nodeContent)}</a>);

                if (nodeContent.length && !nodeUrl) return processNodes(nodeContent);

                return '';
            });

            if (imgUrl) return (
                <Image
                    alt={imgDesc || imgTitle}
                    key={`img-${imgUrl}`}
                    src={`https:${imgUrl}`}
                    height={height}
                    title={imgTitle}
                    width={width} />);

            return processNodes(itemContent);
        });
    }

    return documentToReactComponents(richText, options);
};

export default RichTextRenderer;
