import React, { useEffect, useState } from 'react'
import { Box, Button, Heading, Input, Text, Flex, Checkbox } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from '../toasts'
import { reset } from '../../features/auth/authSlice'
import { register } from '../../features/auth/authSlice'
// Import the video directly if using webpack or similar bundler
import signVideo from '../../assets/vidrrr.mp4'

const SignUp = () => {
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        terms_agreement: false
    })
    const [errors, setErrors] = useState({})
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        if (isError) {
            setErrors(message)
        }
        if (isSuccess) {
            navigate("/verify-activation-otp")
            toast.success(message)
        }
        dispatch(reset())
    }, [isError, isSuccess, message, user, navigate, dispatch])

    const simpleValidation = (name, value) => {
        if (name === 'first_name' || name === 'last_name') {
            if (value.includes(' ')) {
                setErrors({ ...errors, [name]: 'No spacing allowed' })
            } else {
                setErrors({ ...errors, [name]: '' })
            }
        } else if (name === 'password') {
            if (value.length < 8) {
                setErrors({ ...errors, [name]: '8 characters min!' })
            } else {
                setErrors({ ...errors, [name]: '' })
            }
        } else if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setErrors({ ...errors, [name]: 'Invalid email!' })
            } else {
                setErrors({ ...errors, [name]: '' })
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'terms_agreement') {
            setUserData({ ...userData, terms_agreement: e.target.checked });
        } else {
            setUserData({ ...userData, [name]: value })
        }
        simpleValidation(name, value)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(register(userData))
    }

    const loadingButtonAttrs = {
        isLoading,
        loadingText: 'Submitting',
        spinnerPlacement: 'start'
    }

    return (
        <Flex 
            minHeight='100vh' 
            alignItems='center' 
            justifyContent='center' 
            p={[4, 6, 8]}
            bg="gray.50"
        >
            <Flex 
                width={['100%', '100%', '90%', '80%']} 
                maxW='1200px' 
                boxShadow='lg' 
                borderRadius='md' 
                overflow='hidden'
                bg="white"
            >
                {/* Form Section */}
                <Box 
                    flex='1' 
                    bg='white' 
                    p={[4, 6, 8]} 
                    maxW={['100%', '100%', '50%']}
                >
                    <Heading size='xl' mb={2} color="#1A202C">Sign Up</Heading>
                    <Text mb={8}>
                        Do you already have an account? <Link to='/login' style={{ color: 'rgb(78, 53, 220)', fontWeight: 'bold' }}>Log In Here!</Link>
                    </Text>

                    <form method='POST' onSubmit={submitHandler}>
                        <Text fontWeight='medium' mb={1}>First name*</Text>
                        <Input 
                            type='name' 
                            name='first_name' 
                            mb={errors.first_name ? 1 : 4} 
                            required 
                            value={userData.first_name} 
                            onChange={handleChange} 
                            size='md'
                            {...(errors.first_name && { isInvalid: true })}
                        />
                        <Text mb={4} fontSize={13} fontWeight='bold' color='red.500'>{errors?.first_name}</Text>

                        <Text fontWeight='medium' mb={1}>Last name*</Text>
                        <Input 
                            type='name' 
                            name='last_name' 
                            mb={errors.last_name ? 1 : 4} 
                            required 
                            value={userData.last_name} 
                            onChange={handleChange} 
                            size='md'
                            {...(errors.last_name && { isInvalid: true })}
                        />
                        <Text mb={4} fontSize={13} fontWeight='bold' color='red.500'>{errors?.last_name}</Text>

                        <Text fontWeight='medium' mb={1}>Email Address*</Text>
                        <Input 
                            type='email' 
                            name='email' 
                            mb={errors.email ? 1 : 4} 
                            required 
                            value={userData.email} 
                            onChange={handleChange} 
                            size='md'
                            {...(errors.email && { isInvalid: true })}
                        />
                        <Text mb={4} fontSize={13} fontWeight='bold' color='red.500'>{errors?.email}</Text>

                        <Text fontWeight='medium' mb={1}>Password*</Text>
                        <Input 
                            type='password' 
                            name='password' 
                            mb={errors.password ? 1 : 4} 
                            required 
                            value={userData.password} 
                            onChange={handleChange} 
                            size='md'
                            {...(errors.password && { isInvalid: true })}
                        />
                        <Text mb={4} fontSize={13} fontWeight='bold' color='red.500'>{errors?.password}</Text>

                        <Checkbox 
                            name='terms_agreement' 
                            isChecked={userData.terms_agreement} 
                            onChange={handleChange} 
                            required 
                            mb={6}
                            {...(errors.terms_agreement && { isInvalid: true })}
                        >
                            I agree to the Terms & Policy
                        </Checkbox>
                        <Text mb={4} fontSize={13} fontWeight='bold' color='red.500'>{errors?.terms_agreement}</Text>

                        <Button 
                            {...((!Object.values(errors).every(value => value === '')) && { isDisabled: true })}
                            {...(isLoading && { ...loadingButtonAttrs })} 
                            type='submit' 
                            color='white' 
                            bgColor='rgb(78, 53, 220)' 
                            _hover={{ bg: 'blue.800' }} 
                            w='100%'
                            size='md'
                        >
                            Sign Up
                        </Button>
                    </form>
                </Box>
                
                {/* Video Section */}
                <Box 
                    flex='1' 
                    display={['none', 'none', 'block']} 
                    position="relative"
                    overflow="hidden"
                    bg="gray.300"
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,

                        }}
                    >
                        <source src={  signVideo ||"/assets/vidrrr.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    
                    <Box 
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                       bg="rgba(0,0,0,0.1)"
                        zIndex="1"
                    />
                </Box>
            </Flex>
        </Flex>
    )
}

export default SignUp