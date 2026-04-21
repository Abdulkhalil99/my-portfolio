declare module 'nodemailer' {
  namespace nodemailer {
    interface Transporter {
      sendMail(options: {
        from?: string
        to?: string
        replyTo?: string
        subject?: string
        html?: string
        text?: string
      }): Promise<{ messageId: string }>
      verify(): Promise<unknown>
    }

    interface TransportOptions {
      host?: string
      port?: number
      secure?: boolean
      auth?: {
        user?: string
        pass?: string
      }
      tls?: {
        rejectUnauthorized?: boolean
      }
    }

    function createTransport(options: TransportOptions): Transporter
  }

  export = nodemailer
}
