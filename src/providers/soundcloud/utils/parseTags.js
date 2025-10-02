const parseTags = (tagString) => {
    const regex = /"([^"]+)"|(\S+)/g;
    const matches = [...tagString.matchAll(regex)]
        .map(match => match[1] || match[2]);
        
    return [...new Set(matches)].map(tag => tag.replaceAll('_', ' '));
};

export default parseTags;
