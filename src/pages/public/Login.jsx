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
    resendActivationEmail,
    reset,
} from '../../features/auth/authSlice'
import loginimage from '../../assets/login.jpeg'

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

          <Box bg="whiteAlpha.800" p={8} rounded="md" shadow="md" width="400px">
              <Heading mb={6} textAlign="center">
                  Connexion
              </Heading>

              <form onSubmit={handleSubmit}>
                  <Input
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    mb={4}
                  />
                  <Input
                    placeholder="Mot de passe"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    mb={6}
                  />

                  <Button type="submit" colorScheme="blue" width="full" isDisabled={isLoading}>
                      {isLoading ? <Spinner size="sm" /> : 'Se connecter'}
                  </Button>
              </form>

              <Text mt={4} fontSize="sm" textAlign="center">
                  Vous n'avez pas de compte ? <Link to="/register" style={{ color: 'blue' }}>S’inscrire</Link>
              </Text>
              <Text mt={2} fontSize="sm" textAlign="center">
                  <Link to="/reset-password" style={{ color: 'blue' }}>Mot de passe oublié ?</Link>
              </Text>
          </Box>
      </Flex>
    )
}

export default Login
