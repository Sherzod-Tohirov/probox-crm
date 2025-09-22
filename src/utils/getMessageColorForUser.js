// Color map
const userColors = [
  { bg: '#E0F7FA', text: '#006064' },
  { bg: '#F1F8E9', text: '#33691E' },
  { bg: '#FFF9C4', text: '#F57F17' },
  { bg: '#FFEBEE', text: '#C2185B' },
  { bg: '#E3F2FD', text: '#1565C0' },
  { bg: '#F3E5F5', text: '#6A1B9A' },
  { bg: '#FBE9E7', text: '#D84315' },
  { bg: '#ECEFF1', text: '#263238' },
  { bg: '#F9FBE7', text: '#827717' },
  { bg: '#FFF3E0', text: '#E65100' },
  { bg: '#E8F5E9', text: '#1B5E20' },
  { bg: '#E0E0E0', text: '#424242' },
];

// Assume users are fixed (max 10)
const getMessageColorForUser = (username, userList) => {
  console.log(username, 'username', userList);
  const index = userList.indexOf(username);
  if (index === -1) {
    return {
      bg: '#d3d2d29d', // Default background color
      text: '#000000', // Default text color
    };
  }

  return (
    userColors[index % userColors.length] || {
      bg: '#d3d2d29d',
      text: '#000000',
    }
  ); // Default color if not found
};

export default getMessageColorForUser;
