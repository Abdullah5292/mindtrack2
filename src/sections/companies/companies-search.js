import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Box, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const CompaniesSearch = () => (
  <Box sx={{ display: 'flex', justifyContent: 'left', width: '100%' }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search Institutions"
      startAdornment={
        <InputAdornment position="start">
          <SvgIcon color="action" fontSize="small">
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      }
      sx={{
        maxWidth: 500,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 1, // Optional: to give it a softer look
        '& input': {
          color: 'black',
        },
        '&::placeholder': {
          color: 'black',
          opacity: 1,
        },
        '& fieldset': {
          border: 'none !important', // Removes border in all states
        },
        '&:hover': {
          backgroundColor: 'white !important', // Prevents bg from disappearing on hover
        },
        '&:hover fieldset': {
          border: 'none !important',
        },
        '&.Mui-focused': {
          backgroundColor: 'white !important', // Keeps background white when focused
        },
        '&.Mui-focused fieldset': {
          border: 'none !important',
        },
      }}
    />
  </Box>
);
