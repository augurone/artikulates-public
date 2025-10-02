import layoutConfig from 'contentful-layout';
import React from 'react';
import backgroundConfig from 'utils/bgStyles';
import hasContent from 'utils/hasContent';

import RenderComponents from '@/components/builders/RenderComponents';

const Page = ({
    backgroundSettings = [],
    createdAt='',
    layout = {},
    pageComponents = [],
    publishedVersion='',
    revision='',
    tags=[],
    title = '',
    updatedAt='',
    ...props
}) => {
    const { bgAttrs = '', bgStyleStr = '', inlineStyle = null, ...style } = backgroundConfig(backgroundSettings);
    const classes = `${layoutConfig(layout)} ${bgAttrs}`.trim();

    // Merge all styles together
    const combinedStyle = {
        ...(hasContent(style) ? style : {}),
        ...(bgStyleStr ? { backgroundImage: `url(${bgStyleStr})` } : {}),
        ...(inlineStyle || {})
    };

    return (
        <body id="top"
            {...(classes && { className: classes })}
            {...(Object.keys(combinedStyle).length > 0 && { style: combinedStyle })}>
            {pageComponents.map(({ 
                fields = {}, 
                sys: { 
                    contentType: {
                        sys: {
                            id
                        } = {}
                    } = {}
                } = {}
            } = {}, i) => <RenderComponents key={i} contentType={id} { ...fields } />)}
        </body>
    );    
};
export default Page;
