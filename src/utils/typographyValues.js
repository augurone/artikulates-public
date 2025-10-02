const excludes = ['undefined', 'null', 'true', 'false'];
const typogStr = typography => Object.values(typography).filter(val => !!(val && !excludes.includes(val.toString()))).join(' ').trim();

export default typogStr;
