'use client'
import  ReactQueryProvider from "./provider";


const NextAuthSeesionProvider =  ({ children }: { children: React.ReactNode }) => {

  return (

    <ReactQueryProvider>
     {children}   
     </ReactQueryProvider>

  );
};

export default NextAuthSeesionProvider;
