import layoutConfig from 'contentful-layout';
import Image from 'next/image';
import React from 'react';
import imgProps from 'utils/imgProps';

const Asset = ({
    className = '',
    layout = {},
    priority = false,
    fields
}) => {
    const {
        height,
        imgDesc,
        imgTitle,
        imgUrl,
        width
    } = imgProps({ fields });
    
    const src = /https?:/.test(imgUrl) ? imgUrl : `https:${imgUrl}`;
    const classes = `${layoutConfig(layout)} ${className}`.trim();
    
    return (
        <Image
            {...(classes && { className: classes })}
            src={src}
            alt={imgDesc || imgTitle}
            title={imgTitle}
            width={width}
            height={height}
            {...(priority && { priority, loading: 'eager' })} />);
};
        
export default Asset;
