import { Box, Image, Heading, Input, Button, Grid, GridItem, useBreakpointValue, Text } from '@chakra-ui/react'
import React, {  useState } from 'react'
import Logo from '../assets/footer.png';
import FooterPay1 from '../assets/footer-pay1.png';
import FooterPay2 from '../assets/footer-pay2.png';
import FooterPay3 from '../assets/footer-pay3.png';
import FooterPay4 from '../assets/footer-pay4.png';
import FooterPay5 from '../assets/footer-pay5.png';

import '../styles/Footer.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebookF, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const [data, setData] = useState({
        email: "",
    })

    // Styles
    const numDetailCols = useBreakpointValue({ base: 1, md: 2, lg: 4 });
    const numCopyrightCols = useBreakpointValue({ base: 1, md: 2, lg: 2 });
    const payDisplayCols = useBreakpointValue({ base: 3, md: 5, lg: 5 });

    const heading_styles = {
        fontSize: "22px",
        size: 'lg',
        color: "white",
        mb: "15px"
    }

    const link_styles = {
        color: 'white',
        marginBottom: '11px',
        fontSize: '15px',
    }
    // -----------------------------------

    // Data retieval




    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }


    return (
        <Box bottom='0' width='100%' backgroundColor='black' padding='35px'>
            <Grid templateColumns={[`repeat(${numDetailCols}, 1fr)`]} gap={6} padding='60px'>
                <GridItem w='100%' mb={{ lg: '0', md: '20px', sm: '20px' }}>
                    <Heading {...heading_styles}>Join Newsletter</Heading>
                    <ul>
                        <li style={{ color: 'white', maxWidth: '90%', marginBottom: '20px' }}>Subscribe our newsletter to get more free design course and resource.</li>
                        <li style={{ marginBottom: "25px" }}>
                            <form method='POST'>
                                <Input type='email' name='email' value={data.email} onChange={handleChange} placeholder='your email' mb='10px' backgroundColor='white' />
                                <br />
                                <Button  type='submit' backgroundColor='rgb(78, 53, 220)' _hover={{ bg: 'rgb(98, 73, 240)' }} color='white'>Submit</Button>
                            </form>
                        </li>
                        <li >
                            <FontAwesomeIcon icon={faTwitter} color='white' size='lg' style={{ marginRight: '25px' }} />
                            <FontAwesomeIcon icon={faFacebookF} color='white' size='lg' style={{ marginRight: '25px' }} />
                            <FontAwesomeIcon icon={faWhatsapp} color='white' size='lg' style={{ marginRight: '25px' }} />
                            <FontAwesomeIcon icon={faInstagram} color='white' size='lg' style={{ marginRight: '25px' }} />
                        </li>
                    </ul>
                </GridItem>
                <GridItem paddingRight='25px' w='100%'>
                    <Heading {...heading_styles}>Important Links</Heading>
                    <ul>
                        <li style={link_styles}><Link to='/listings'>All Products</Link></li>
                        <li style={link_styles}><Link to='#'>How It Works</Link></li>
                        <li style={link_styles}><Link to='/dashboard'>My Account</Link></li>
                        <li style={link_styles}><Link to='#'>About Company</Link></li>
                        <li style={link_styles}><Link to='#'>Our News Feed</Link></li>
                    </ul>
                </GridItem>
                <GridItem paddingRight='25px' w='100%'>
                    <Heading {...heading_styles}>Help & FAQs</Heading>
                    <ul>
                        <li style={link_styles}><Link to='#'>Help Centre</Link></li>
                        <li style={link_styles}><Link to='#'>Customer FAQs</Link></li>
                        <li style={link_styles}><Link to='#'>Terms and Conditions</Link></li>
                        <li style={link_styles}><Link to='#'>Security Information</Link></li>
                        <li style={link_styles}><Link to='#'>Merchant Add Policy</Link></li>
                    </ul>

                </GridItem>
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
            <Grid templateColumns={[`repeat(${numCopyrightCols}, 1fr)`]} padding='20px 20px 0 20px' alignItems='center'>
                <GridItem color='white'>Copyright: BIDTUN ©{new Date().getFullYear()}</GridItem>
                <GridItem color="white" marginLeft={{ md: 'auto' }} marginTop={{ sm: '13px' }}>
                    <Text mb={2} mt={{ base: 4, md: 0 }}>We accept: </Text>
                    <Grid gap={4} templateColumns={[`repeat(${payDisplayCols}, 1fr)`]}>
                        <Image src={FooterPay1} alt='Logo' />
                        <Image src={FooterPay2} alt='Logo' />
                        <Image src={FooterPay3} alt='Logo' />
                        <Image src={FooterPay4} alt='Logo' />
                        <Image src={FooterPay5} alt='Logo' />
                    </Grid>
                </GridItem>
            </Grid>
        </Box>
    )
}

export default Footer