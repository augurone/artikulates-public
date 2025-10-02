const imgProps = ({
    fields: {
        description: imgDesc = '',
        title: imgTitle = '',
        file: {
            details: {
                image: {
                    height = '', 
                    width = ''
                } = {}
            } = {},
            url: imgUrl = ''
        } = {}
    } = {}
}) => ({
    height,
    imgDesc,
    imgTitle,
    imgUrl,
    width
});

export default imgProps;
