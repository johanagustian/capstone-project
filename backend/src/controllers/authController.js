import { pool } from '../services/database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-default'

export const handleRegister = async (req, res) => {
  const { username, email, password, role_id } = req.body
  if (!username || !email || !password || !role_id) {
    return res.status(400).json({ message: 'Semua field harus diisi' })
  }
  try {
    const [existing] = await pool.query('SELECT id FROM tb_users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.query(
      'INSERT INTO tb_users (username, email, pass, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role_id]
    )
    res.status(201).json({ message: 'Pendaftaran berhasil! Silakan login.' })
  } catch (error) {
    res.status(500).json({ message: 'Gagal mendaftar', error: error.message })
  }
}

export const handleLogin = async (req, res) => {
  const { email, password, role_id } = req.body
  if (!email || !password || !role_id) {
    return res.status(400).json({ message: 'Email, password, dan role harus diisi' })
  }
  try {
    const [rows] = await pool.query(
      'SELECT u.*, r.name as role_name FROM tb_users u JOIN tb_roles r ON u.role_id = r.id WHERE u.email = ? AND u.role_id = ?',
      [email, role_id]
    )
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }
    const isMatch = await bcrypt.compare(password, user.pass)
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }
    const tokenPayload = { id: user.id, username: user.username, email: user.email, role: user.role_name }
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' })
    res.json({ message: 'Login berhasil', token, user: tokenPayload })
  } catch (error) {
    res.status(500).json({ message: 'Login gagal', error: error.message })
  }
}

