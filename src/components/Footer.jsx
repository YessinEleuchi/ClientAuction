import { Box, Image, Heading, Input, Button, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import Logo from '../assets/footer.png';
import '../styles/Footer.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebookF, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const [data, setData] = useState({ email: "" });

    const numDetailCols = useBreakpointValue({ base: 1, md: 2, lg: 4 });
    const numCopyrightCols = useBreakpointValue({ base: 1, md: 2, lg: 2 });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const heading_styles = {
        fontSize: "22px",
        size: 'lg',
        color: "white",
        mb: "15px"
    };

    const link_styles = {
        color: 'white',
        marginBottom: '11px',
        fontSize: '15px',
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    // Composant pour gérer les liens avec scroll automatique
    const FooterLink = ({ to, children }) => (
      <li style={link_styles}>
          <Link to={to} onClick={scrollToTop}>{children}</Link>
      </li>
    );

    return (
      <Box bottom='0' width='100%' backgroundColor='black' padding='35px'>
          <Grid templateColumns={[`repeat(${numDetailCols}, 1fr)`]} gap={6} padding='60px'>
              {/* Newsletter */}
              <GridItem w='100%' mb={{ lg: '0', md: '20px', sm: '20px' }}>
                  <Heading {...heading_styles}>Join Newsletter</Heading>
                  <ul>
                      <li style={{ color: 'white', maxWidth: '90%', marginBottom: '20px' }}>
                          Subscribe our newsletter to get more free design course and resource.
                      </li>
                      <li style={{ marginBottom: "25px" }}>
                          <form method='POST'>
                              <Input
                                type='email'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                                placeholder='your email'
                                mb='10px'
                                backgroundColor='white'
                              />
                              <br />
                              <Button
                                type='submit'
                                backgroundColor='rgb(78, 53, 220)'
                                _hover={{ bg: 'rgb(98, 73, 240)' }}
                                color='white'
                              >
                                  Submit
                              </Button>
                          </form>
                      </li>
                      <li>
                          <FontAwesomeIcon icon={faTwitter} color='white' size='lg' style={{ marginRight: '25px' }} />
                          <FontAwesomeIcon icon={faFacebookF} color='white' size='lg' style={{ marginRight: '25px' }} />
                          <FontAwesomeIcon icon={faWhatsapp} color='white' size='lg' style={{ marginRight: '25px' }} />
                          <FontAwesomeIcon icon={faInstagram} color='white' size='lg' style={{ marginRight: '25px' }} />
                      </li>
                  </ul>
              </GridItem>

              {/* Important Links */}
              <GridItem paddingRight='25px' w='100%'>
                  <Heading {...heading_styles}>Important Links</Heading>
                  <ul>
                      <FooterLink to='/listings'>All Products</FooterLink>
                      <FooterLink to='/how'>How It Works</FooterLink>
                      <FooterLink to='/dashboard'>My Account</FooterLink>
                      <FooterLink to='/explore'>About Company</FooterLink>
                      <FooterLink to='#'>Our News Feed</FooterLink>
                  </ul>
              </GridItem>

              {/* Help & FAQs */}
              <GridItem paddingRight='25px' w='100%'>
                  <Heading {...heading_styles}>Help & FAQs</Heading>
                  <ul>
                      <FooterLink to='/listings'>All Products</FooterLink>
                      <FooterLink to='/how'>How It Works</FooterLink>
                      <FooterLink to='/dashboard'>My Account</FooterLink>
                      <FooterLink to='/explore'>About Company</FooterLink>
                      <FooterLink to='#'>Our News Feed</FooterLink>
                  </ul>
              </GridItem>

              {/* Contact Info & Logo */}
              <GridItem paddingRight='25px' w='100%'>
                  <Image
                    src={Logo}
                    alt='Logo'
                    mb='3.5'
                    style={{ width: '150px', height: 'auto' }}
                  />
                  <ul>
                      <li style={link_styles}>Phone: +216 74 263 512</li>
                      <li style={link_styles}>Email: TUNBID@email.com</li>
                  </ul>
              </GridItem>
          </Grid>

          <hr />

          {/* Copyright */}
          <Grid templateColumns={[`repeat(${numCopyrightCols}, 1fr)`]} padding='20px 20px 0 20px' alignItems='center'>
              <GridItem color='white'>
                  Copyright: BIDTUN ©{new Date().getFullYear()}
              </GridItem>
          </Grid>
      </Box>
    );
};

export default Footer;
