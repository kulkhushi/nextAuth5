import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenMail=async(email:string, token:string)=>{
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Hello world',
    html:`<h2>Your 2FA Code is: ${token}</h2>`
  });
  if(error){
    throw new Error("Failed to send verification email");
  }else{
    return data
  }
}

export const sendPasswordReseetEmail=async(email:string,token:string)=>{
  const conFirmLink = `http://localhost:3000/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Hello world',
      html:`<h2> Click <a href="${conFirmLink}">Here</a> To confirm</h2>`
    });
    if(error){
      throw new Error("Failed to send verification email");
    }else{
      return data
    }
}

export const sendVerificationEmail=async(email:string,token:string)=>{
    const conFirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Hello world',
        html:`<h2> Click <a href="${conFirmLink}">Here</a> To confirm</h2>`
      });
      if(error){
        throw new Error("Failed to send verification email");
      }else{
        return data
      }
}