import { auth } from '@/auth';
import Logout from '@/components/auth/LogOut';
import { signOut } from 'next-auth/react';
import React from 'react'

const SettingsPage = async () => {
    const session = await auth();
  
  return (
    <div>
        {JSON.stringify(session)}
   
       <Logout/>
   
    </div>
  )
}

export default SettingsPage