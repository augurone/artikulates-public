import React from 'react';

import PageComponent from '@/components/builders/PageComponent';
import RenderPage from '@/components/builders/RenderPage';


const RenderComponents = ({
    collection = {},
    componentName = '',
    contentType,
    oddEven,
    pageName: name = '',
    slug = '',
    title = '',
    ...fields
} = {}) => {
    const {
        collectionType = '',
        enableRiverflow = false
    } = collection;
    const {
        typeClass
    } = fields;

    // console.log({ collectionType });

    switch(contentType) {
        case 'page': {
            if (collectionType) {
                return (
                    <RenderPage
                        collection={collection}
                        fields={fields}
                        {...((enableRiverflow && oddEven) && { oddEven })}
                        slug={slug}
                        title={title} />
                );
            }

            return <a 
                key={slug}
                href={`/${slug}`}
                {...( typeClass && { className: typeClass })}>
                {name || title}
            </a>;
        }
        case 'pageComponent':
        case 'component':
        default:
            return <PageComponent key={title || name || componentName} {...fields} />;
    }
};

export default RenderComponents;
