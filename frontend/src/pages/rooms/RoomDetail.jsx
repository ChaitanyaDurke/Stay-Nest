import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  LocationOn,
  Wifi,
  AcUnit,
  LocalParking,
  Pool,
  Restaurant,
  Security,
  ArrowBack,
  ArrowForward,
  Favorite,
  Share,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ImageGallery = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '500px',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
}));

const ThumbnailGallery = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  overflowX: 'auto',
  paddingBottom: theme.spacing(1),
  '& img': {
    width: 100,
    height: 70,
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    border: '2px solid transparent',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& img.active': {
    borderColor: theme.palette.primary.main,
  },
}));

const AmenityIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '40px',
  color: theme.palette.primary.main,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const RoomDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  // Mock data - Replace with actual API call
  const roomData = {
    name: 'Deluxe Suite',
    rating: 4.5,
    price: 150,
    location: 'Downtown Area',
    description: 'Spacious and modern suite with city views. Perfect for both business and leisure travelers.',
    amenities: [
      { icon: <Wifi />, text: 'Free WiFi' },
      { icon: <AcUnit />, text: 'Air Conditioning' },
      { icon: <LocalParking />, text: 'Free Parking' },
      { icon: <Pool />, text: 'Swimming Pool' },
      { icon: <Restaurant />, text: 'Restaurant' },
      { icon: <Security />, text: '24/7 Security' },
    ],
    images: [
      'https://source.unsplash.com/800x600/?hotel-room',
      'https://source.unsplash.com/800x600/?luxury-room',
      'https://source.unsplash.com/800x600/?suite',
    ],
  };

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, pt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Image Gallery */}
          <Grid item xs={12}>
            <ImageGallery>
              <img src={roomData.images[currentImage]} alt={roomData.name} />
            </ImageGallery>
            <ThumbnailGallery>
              {roomData.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={currentImage === index ? 'active' : ''}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </ThumbnailGallery>
          </Grid>

          {/* Room Information & Amenities - now full width */}
          <Grid item xs={12}>
            <Stack spacing={3}>
              <StyledPaper elevation={0} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {roomData.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Rating value={roomData.rating} precision={0.5} readOnly />
                      <Typography variant="body1" color="text.secondary">
                        ({roomData.rating})
                      </Typography>
                      <Chip
                        icon={<LocationOn />}
                        label={roomData.location}
                        size="medium"
                        sx={{ bgcolor: 'primary.light', color: 'white' }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton>
                      <Favorite />
                    </IconButton>
                    <IconButton>
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  {roomData.description}
                </Typography>
              </StyledPaper>

              {/* Amenities */}
              <StyledPaper elevation={0} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Amenities
                </Typography>
                <Grid container spacing={3}>
                  {roomData.amenities.map((amenity, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Card elevation={0} sx={{ bgcolor: 'background.default' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AmenityIcon>{amenity.icon}</AmenityIcon>
                            <Typography variant="body1">{amenity.text}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </StyledPaper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RoomDetail; 