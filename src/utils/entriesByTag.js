const entriesByTag = (entries = [], tag = '') => entries.filter(({
    metadata: {
        tags = []
    } = {}
} = {}) => {
    const tagList = tags.find(({ sys: { id } = {} }) => id === tag );

    return !!tagList;
});

export default entriesByTag;
