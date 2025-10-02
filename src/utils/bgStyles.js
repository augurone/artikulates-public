const gradientColors = (applyGradientColors = []) => applyGradientColors.map(
    ({
        fields: {
            opacity = '',
            color: {
                fields: {
                    family = '',
                    shade = ''
                } = {}
            } = {},
            colorType = ''
        } = {}
    }) => {
        if (!colorType || !family) return '';

        const baseStr = `${colorType}-${family}`;
        const shadeStr = shade ? `${baseStr}-${shade}` : baseStr;

        return opacity ? `${shadeStr}/${opacity}` : shadeStr;
    }
);

/*
    @param {Array} backgroundSetting 
    @returns {Object}
*/
const backgroundConfig = (backgroundSetting = []) => {
    /*
        A majority of backgroundImage applications will be 1 image or 1 gradient.
        The tailwind classes work well for this use case. This extracts the 
        TW utility classes directly to be applied to the element calling them.
        For actual images(w/url) an inline style is applied for bakgroundImage.
        ** Currently only 1 gradient may be applied with up to 3 colors **
        * bg-gradient-to-t from-black
         - produces a gradient that is black at the bottom and tranparent at the top. 
        * bg-gradient-to-tr from-red via-white to-blue
         - produces a diagonal gradient from bottom left (red) to (white) to top right(blue)
    */
    if (backgroundSetting.length === 1) {
        const [{
            fields: {
                applyGradientColors = [],
                asset: {
                    fields: {
                        file: {
                            url = ''
                        } = {}
                    } = {} 
                } = {},
                backgroundClip = '',
                backgroundGradient = '',
                backgroundOrigin = '',
                backgroundPosition = '',
                backgroundRepeat = '',
                backgroundSize = '',
                breakpointPrefix: {
                    fields: {
                        value: breakpointPrefix = ''
                    } = ''
                }= {},
                ...props
            } = {}
        }] = backgroundSetting;

        const baseParts = [
            backgroundClip,
            backgroundOrigin,
            backgroundPosition,
            backgroundRepeat,
            backgroundSize,
            backgroundGradient,
            ...gradientColors(applyGradientColors)
        ];

        // For dynamic URLs, use inline styles instead of Tailwind classes
        // This prevents build-time template literal issues
        const useUrl = /https:/g.test(url) ? url : `https:${url}`;
        const inlineStyle = useUrl ? { backgroundImage: `url('${useUrl}')` } : {};

        const base = baseParts.join(' ').replace(/\s{2,}/g, ' ').trim();
        const applyString = breakpointPrefix ? `${breakpointPrefix}:${base}` : base;

        return {
            bgAttrs: applyString,
            ...(Object.keys(inlineStyle).length > 0 && { inlineStyle }),
            ...(url && { bgStyleStr: /^https?:/.test(url)  ? url : `https:${url}` })
        };
    }

    /*
        **Utility function**: appends a value where one exists, or returns new value where one does not
        cleans tailwind prefiix from entries. 
        @return {String}
    */
    const prepString = (prop = '', data = '') => {
        if (!data) return prop;

        // strip leading "bg-" if it sneaks in
        const cleanStr = data.replace(/^bg-/, '').trim();

        // gather existing values, dedupe, and return a comma‑separated list
        const existing = prop
            ? prop
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : [];
        const merged = Array.from(new Set([...existing, cleanStr]));

        return merged.join(', ');
    };

    /*
        Tailwind utility classes cannot be applied where multiple background items exist
        Instead a inline style attribute is created to apply to the calling element. 
        This does not currently support gradients, because the translation from TW 
        to attributes is laborious.
    */
    return backgroundSetting.reduce((styleOb, {
        fields: {
            asset: {
                fields: {
                    file: {
                        url = ''
                    } = {}
                } = {} 
            } = {},
            backgroundClip = '',
            backgroundOrigin = '',
            backgroundPosition = '',
            backgroundRepeat = '',
            backgroundSize = ''
        } = {}
    }) => {
        if (backgroundClip) styleOb.backgroundClip = prepString(styleOb.backgroundClip, backgroundClip);

        if (backgroundOrigin) styleOb.backgroundOrigin = prepString(styleOb.backgroundOrigin, backgroundOrigin);

        if (backgroundPosition) {
            const usePosition =  backgroundPosition.replace(/bg-/g, '').split('-').join(' ');
        
            styleOb.backgroundPosition = prepString(styleOb.backgroundPosition, usePosition);
        }

        if (backgroundRepeat) styleOb.backgroundRepeat = prepString(styleOb.backgroundRepeat, backgroundRepeat);

        if (backgroundSize) styleOb.backgroundSize = prepString(styleOb.backgroundSize, backgroundSize);

        if (url) {
            const useUrl = /https:/g.test(url) ? url : `https:${url}`;
            styleOb.backgroundImage = prepString(styleOb.backgroundImage, `url(${useUrl})`);
        }

        return styleOb;

    }, {
        backgroundClip: '',
        backgroundOrigin: '',
        backgroundPosition: '',
        backgroundRepeat: '',
        backgroundSize: '',
        backgroundImage: ''
    });
};

export default backgroundConfig;
