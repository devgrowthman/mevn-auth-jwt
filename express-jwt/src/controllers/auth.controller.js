import bcrypt from 'bcrypt';
import crypto from 'crypto'
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

const register = async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;
    
    const errors = {};

    if (!username) errors.username = 'Username wajib diisi';
    if (!name) errors.name = 'Nama wajib diisi';
    if (!email) errors.email = 'Email wajib diisi';
    if (!password) errors.password = 'Password wajib diisi';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validasi gagal',
        errors
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username
      }
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Username sudah digunakan'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const allowedRoles = ['USER', 'ADMIN']
    const userRole = role && allowedRoles.includes(role.toUpperCase()) ? role.toUpperCase() : 'USER'

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        role: userRole
      }
    })

    return res.status(201).json({
      message: 'User berhasil didaftarkan',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username dan password wajib diisi'
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })

    if (!user) {
      return res.status(401).json({
        message: 'Username atau password salah'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Username atau password salah'
      })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    )

    // enhance : adding hash to plain refreshToken
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await prisma.refreshToken.create({
      data: {
        // token: refreshToken,
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt
      }
    })

    res.cookie(
      'refreshToken',
      refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        sameSite: 'lax',        // lebih cocok untuk development

        maxAge: 7 * 24 * 60 * 60 * 1000
      }
    )

    return res.status(200).json({
      message: 'Login berhasil',
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token tidak ditemukan'
      })
    }
    
    const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: {
        // token: refreshToken
        token: hashed
      },
      include: {
        user: true
      }
    })

    if (!tokenRecord) {
      res.clearCookie('refreshToken')

      return res.status(403).json({
        message: 'Refresh token tidak valid'
      })
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    // tanpa implementasi rotation token
    // const accessToken = generateAccessToken(tokenRecord.user)
    // return res.json({
    //   accessToken
    // })

    // execute rotation
    // - hapus token lama di DB
    await prisma.refreshToken.delete({
      where: {
        token: hashed
      }
    })

    // - generate token yang baru dan simpan ke db
    const accessToken = generateAccessToken(tokenRecord.user)
    const newRefreshToken = generateRefreshToken(tokenRecord.user)

    const newHashed = crypto.createHash('sha256').update(newRefreshToken).digest('hex')

    await prisma.refreshToken.create({
      data: {
        token: newHashed,
        userId: tokenRecord.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.cookie(
      'refreshToken',
      newRefreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    )

    return res.json({
      accessToken
    })

  } catch(error) {
    console.log('cek refresh error', error)

    res.clearCookie('refreshToken')
    
    return res.status(403).json({
      message: 'Refresh token expired'
    })
  }
}

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(200).json({
        message: 'Logout berhasil'
      })
    }

    await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken
      }
    })

    res.clearCookie(
      'refreshToken',
      {
        httpOnly: true,
        sameSite: 'strict',
        secure: false
      }
    )

    return res.status(200).json({
      message: 'Logout berhasil'
    })

  } catch(error) {
    console.log('error logout', error)

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

const profile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    
    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      })
    }
  
    return res.json(user)
  } catch(error) {
    console.log('get profile error', error)

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

export { register, login, refresh, logout, profile };