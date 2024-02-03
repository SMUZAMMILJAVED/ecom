import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";


export default function Home() {
  const { data: session } = useSession();
  // console.log({session})
  return(
   <Layout> 
    <div className="text-blue-900 flex justify-between">
    <h2>Hello, <b> {session?.user?.name}</b></h2>
    <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
    {/* <img className="w-6 h-6 rounded-lg" src={session?.user?.image}></img>  */}
    <Image width={200} height={200} className="w-6 h-6 rounded-lg" src={session?.user?.image} alt={session?.user?.image}/>
    <span className="px-2">{session?.user?.name}</span>
    </div>
    
    </div>
   </Layout>
  )
}
