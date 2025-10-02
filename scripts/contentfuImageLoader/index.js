const contentfuImageLoader = ({ src, width, quality = 75 }) => {
    const url = new URL(`${src}`);

    url.searchParams.set('fm', 'webp');
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', (quality).toString());
    
    return url.href;
};

export default contentfuImageLoader;
