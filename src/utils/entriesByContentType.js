const entriesByContentType = (linkedEntries = [], contentType = '') => linkedEntries.filter((
    {
        sys: {
            contentType: {
                sys: {
                    id = ''
                } = {}
            } = {}
        } = {}
    } = {}) => id === contentType);

export default entriesByContentType;
