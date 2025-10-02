import layoutConfig from 'contentful-layout';
import React from 'react';
import backgroundConfig from 'utils/bgStyles';
import hasContent from 'utils/hasContent';
import typogStr from 'utils/typographyValues';

const LayoutComponent = ({
    as: Component = 'div',
    backgroundSetting = [],
    children = [],
    layoutConfig: layout = [],
    ...props
}) => {
    const {
        fields: { 
            customizationData: {
                typography: {
                    applyToParent = false,
                    ...typeSettings
                } = {}
            } = {} 
        } = {}
    } = layout;
    const typeSettingParent = applyToParent ? typogStr(typeSettings) : '';
    const { bgAttrs = '', bgStyleStr = '', inlineStyle = null, ...style } = backgroundConfig(backgroundSetting);
    const layoutClasses = `${layoutConfig(layout)}`.trim();
    const classes = [layoutClasses, typeSettingParent, bgAttrs].filter(Boolean).join(' ');

    // Merge all styles together
    const combinedStyle = {
        ...(hasContent(style) ? style : {}),
        ...(bgStyleStr ? { backgroundImage: `url(${bgStyleStr})` } : {}),
        ...(inlineStyle || {})
    };

    return (
        <Component
            {...(classes && { className: classes })}
            {...(Object.keys(combinedStyle).length > 0 && { style: combinedStyle })}> 
            {children}
        </Component>
    );
};

export default LayoutComponent;
