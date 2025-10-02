const hasTag = (tags = [], tagId = '') => !!(tags.find(({
    sys: { 
        id = ''
    } = {}
} = {}) => id === tagId));

export default hasTag;
