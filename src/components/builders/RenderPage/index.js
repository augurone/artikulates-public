import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import Asset from '@/components/atomic/Asset';

const RenderPage = ({
    collection: {
        layouts: {
            abstract,
            image, 
            text
        }
    }={},
    fields: {
        metaImage: { fields = {} } = {},
        metaDescription = '',
        metaTitle = ''
    }={},
    oddEven,
    slug
}) => {
    const subjectArr = metaTitle.split(':');
    const subject = subjectArr.length > 1 ? subjectArr[1] : metaTitle;
    const {
        heading3Font,
        heading3Whitespace,
        paragraphFont,
        linkAlignment = '',
        linkColor = '',
        linkFont = '',
        linkWhitespace = ''
    } = text;
    const [, title = ''] = metaTitle.split(':');
    const h3Style = [heading3Font, heading3Whitespace].join(' ').trim();
    const [descr0 = '', descr1 = ''] = metaDescription.split(':');
    const assetStyle = `${image} ${oddEven === 'even' ? 'order-1' : ''}`.trim();
    const linkStyle = [linkAlignment, linkColor, linkFont, linkWhitespace].join(' ').trim();
    const linkMods = `flex items-center gap-2 self-start mt-auto ${oddEven === 'even' ? 'ml-auto' : ''}`.trim();
    /**/
    return (
        <figure className={`${abstract} last:mb-0`}>
            <Asset {...(assetStyle && { className: assetStyle })} fields={fields} />
            <figcaption className="flex flex-col">
                <h3 className={h3Style}>{title || metaTitle}</h3>
                <p className={`${paragraphFont} line-clamp-3`}>{descr1 || descr0}</p>
                <a className={`${linkStyle} ${linkMods}`} href={`/${slug}`} title={`Learn more about ${subject}`}>
                    {`Learn more about ${subject}`}
                    <FontAwesomeIcon className='text-cyan-400' icon="fa-solid fa-right-long" />
                </a>
            </figcaption>
        </figure>
    );
};

export default RenderPage;
