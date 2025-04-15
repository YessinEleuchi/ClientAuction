import React, { useEffect, useState } from 'react'
import { Box, Button, Heading, Input, Text, Flex, Checkbox } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from '../toasts'
import { reset } from '../../features/auth/authSlice'
import { register } from '../../features/auth/authSlice'
// Import the video directly if using webpack or similar bundler
import loginimage from '../../assets/Login.png'

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



    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        maxH="100vh" // Restrict height to viewport
        overflow="hidden"
      >
          <Box
            position="absolute"
            w="100%"
            h="100%"
            bgImage={`url(${loginimage})`}
            bgSize="cover"
            bgPosition="center"
            zIndex="-1"
          />

          <Box
            bg="whiteAlpha.900"
            p={10}
            rounded="lg"
            shadow="lg"
            width={{ base: '90%', sm: '500px' }}
            maxW="600px"
          >
              <Heading mb={8} textAlign="center" fontSize="3xl">
                  Sign Up
              </Heading>

              <form method="POST" onSubmit={submitHandler}>
                  <Text fontWeight="medium" mb={2}>
                      First name*
                  </Text>
                  <Input
                    type="name"
                    name="first_name"
                    mb={errors.first_name ? 2 : 6}
                    required
                    value={userData.first_name}
                    onChange={handleChange}
                    size="lg"
                    fontSize="md"
                    borderColor="gray.300"
                    {...(errors.first_name && { isInvalid: true })}
                  />
                  <Text mb={errors.first_name ? 6 : 0} fontSize="sm" color="red.500">
                      {errors?.first_name}
                  </Text>

                  <Text fontWeight="medium" mb={2}>
                      Last name*
                  </Text>
                  <Input
                    type="name"
                    name="last_name"
                    mb={errors.last_name ? 2 : 6}
                    required
                    value={userData.last_name}
                    onChange={handleChange}
                    size="lg"
                    fontSize="md"
                    borderColor="gray.300"
                    {...(errors.last_name && { isInvalid: true })}
                  />
                  <Text mb={errors.last_name ? 6 : 0} fontSize="sm" color="red.500">
                      {errors?.last_name}
                  </Text>

                  <Text fontWeight="medium" mb={2}>
                      Email Address*
                  </Text>
                  <Input
                    type="email"
                    name="email"
                    mb={errors.email ? 2 : 6}
                    required
                    value={userData.email}
                    onChange={handleChange}
                    size="lg"
                    fontSize="md"
                    borderColor="gray.300"
                    {...(errors.email && { isInvalid: true })}
                  />
                  <Text mb={errors.email ? 6 : 0} fontSize="sm" color="red.500">
                      {errors?.email}
                  </Text>

                  <Text fontWeight="medium" mb={2}>
                      Password*
                  </Text>
                  <Input
                    type="password"
                    name="password"
                    mb={errors.password ? 2 : 6}
                    required
                    value={userData.password}
                    onChange={handleChange}
                    size="lg"
                    fontSize="md"
                    borderColor="gray.300"
                    {...(errors.password && { isInvalid: true })}
                  />
                  <Text mb={errors.password ? 6 : 0} fontSize="sm" color="red.500">
                      {errors?.password}
                  </Text>

                  <Checkbox
                    name="terms_agreement"
                    isChecked={userData.terms_agreement}
                    onChange={handleChange}
                    required
                    mb={8}
                    size="md"
                    {...(errors.terms_agreement && { isInvalid: true })}
                  >
                      I agree to the Terms & Policy
                  </Checkbox>
                  <Text mb={errors.terms_agreement ? 6 : 0} fontSize="sm" color="red.500">
                      {errors?.terms_agreement}
                  </Text>

                  <Button
                    {...(!Object.values(errors).every((value) => value === '') && {
                        isDisabled: true,
                    })}
                    {...(isLoading && {
                        isLoading,
                        loadingText: 'Submitting',
                        spinnerPlacement: 'start',
                    })}
                    type="submit"
                    color="white"
                    bgColor="rgb(78, 53, 220)"
                    _hover={{ bg: '#5538D4' }}
                    w="100%"
                    size="lg"
                    fontSize="md"
                    py={6}
                  >
                      Sign Up
                  </Button>
              </form>

              <Text mt={6} fontSize="md" textAlign="center">
                  Do you already have an account?{' '}
                  <Link
                    to="/login"
                    style={{ color: 'blue', fontWeight: 'medium' }}
                  >
                      Log In Here!
                  </Link>
              </Text>
          </Box>
      </Flex>
    );
};

export default SignUp;