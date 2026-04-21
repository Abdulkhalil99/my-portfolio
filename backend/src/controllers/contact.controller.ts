import { Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'
import { sendContactEmails } from '../services/email.service'
import { ApiResponse } from '../types'

// We import io lazily to avoid circular imports
function getIO() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../services/socket.service').io
  } catch {
    return null
  }
}

// POST /api/contact
export async function sendContactMessage(
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, subject, message } = req.body

    // Save to database first
    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject:   subject || 'No subject',
        message,
        ipAddress: req.ip || null,
      },
    })

    console.log(`\n💾 Message saved — ID: ${saved.id}`)

    // Send emails in background
    sendContactEmails({
      id:      saved.id,
      name:    saved.name,
      email:   saved.email,
      subject: saved.subject,
      message: saved.message,
    }).catch(err => console.error('Email error:', err))

    // Notify all connected visitors via Socket.io
    const io = getIO()
    if (io) {
      io.emit('contact-received', {
        timestamp: new Date().toISOString(),
      })
    }

    res.status(201).json({
      success: true,
      message: 'Message received! I will reply within 24 hours.',
      data:    { id: saved.id },
    } as ApiResponse)

  } catch (error) {
    next(error)
  }
}

// GET /api/contact
export async function getContactMessages(
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.status(200).json({
      success: true,
      data:    messages,
      meta:    { total: messages.length },
    } as ApiResponse)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/contact/:id/read
export async function markAsRead(
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> {
  try {
    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data:  { read: true },
    })

    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}
