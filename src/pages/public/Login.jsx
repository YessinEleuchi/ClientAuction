import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Heading,
    Input,
    Text,
    Flex,
    Spinner,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from '../toasts'
import {
    login,
    reset,
} from '../../features/auth/authSlice'
import loginimage from '../../assets/Login.png'

const Login = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })

    const { email, password } = userData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isSuccess, isError, message } = useSelector(
      (state) => state.auth
    )

    useEffect(() => {
        if (isError) {
            toast.error(message || 'Erreur de connexion.')
        }

        if (isSuccess || user) {
            toast.success('Connexion réussie !')
            navigate('/')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, dispatch, navigate])

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Veuillez remplir tous les champs.')
            return
        }

        dispatch(login(userData))
    }

    return (
      <Flex direction="column" align="center" justify="center" minH="100vh">
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
                  Connexion
              </Heading>

              <form onSubmit={handleSubmit}>
                  <Input
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    mb={6}
                    size="lg"
                    fontSize="md"
                    borderColor="gray.300"
                  />
                  <Input
                    placeholder="Mot de passe"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    mb={8}
                    size="lg"
                    fontSize="md"
                    borderColor="gray.300"
                  />

                  <Button
                    type="submit"
                    color="white"
                    bgColor="rgb(78, 53, 220)"
                    _hover={{ bg: '#5538D4' }}
                    w="100%"
                    size="lg"
                    fontSize="md"
                    isDisabled={isLoading}
                    py={6}
                  >
                      {isLoading ? <Spinner size="sm" /> : 'Se connecter'}
                  </Button>
              </form>

              <Text mt={6} fontSize="md" textAlign="center">
                  Vous n'avez pas de compte ?{' '}
                  <Link to="/signup" style={{ color: 'blue', fontWeight: 'medium' }}>
                      S’inscrire
                  </Link>
              </Text>
              <Text mt={3} fontSize="md" textAlign="center">
                  <Link
                    to="/reset-password"
                    style={{ color: 'blue', fontWeight: 'medium' }}
                  >
                      Mot de passe oublié ?
                  </Link>
              </Text>
          </Box>
      </Flex>
    );
};

export default Login;