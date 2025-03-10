import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from '@mui/material';



export const CompanyCard = (props) => {
  const { company } = props;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
        color: 'white', // White text
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
          <Avatar
            src={company.logo}
            variant="square"
          />
        </Box>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
          sx={{ color: 'white' }} // Ensure white text
        >
          {company.title}
        </Typography>
        <Typography
          align="center"
          variant="body1"
          sx={{ color: 'white' }} // Ensure white text
        >
          {company.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
    </Card>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired
};
