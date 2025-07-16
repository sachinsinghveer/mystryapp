'use client'
import {MessageCard} from '@/components/MessageCard';
import { Message, User } from '@/models/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Dashboard() {
  const [messages,setMessages]=useState<Message[]>([]);
  const[isLoading,setIsLoading]=useState(false);
  const [isSwitchingLoading,setIsSwichingLoading]=useState(false);

const handleDeleteMessage=(messageId:string)=>{
  setMessages(messages.filter((message)=> message._id !== messageId))
}

const {data:session}=useSession()

const form=useForm({
  resolver:zodResolver(acceptMessageSchema)
})

const {register,watch,setValue}=form;


  const acceptMessage = watch('acceptMessage');

const fetchAcceptMessage=useCallback(async ()=>{
  setIsSwichingLoading(true)
  try {
    const response=await axios.get<ApiResponse>('/api/accept-messages')
    setValue('acceptMessage', response.data.isAcceptingMessage ?? false)
    

  } catch (error) {
    const axiosError=error as AxiosError<ApiResponse>
// ...existing code...
toast.error(
  axiosError.response?.data.message || "Failed to fetch message settings",
  );
// ...existing code...
  }
  finally{
    setIsSwichingLoading(false);
  }
},[setValue])

const fetchMessages=useCallback(
  async (refresh :boolean=false)=>{
  setIsLoading(true)
  setIsSwichingLoading(true);
  try {
   const response= await axios.get<ApiResponse>('/api/get-messages')
   setMessages(response.data.messages||[]);
   if(refresh){
    toast("Refreshed Messages",{
      description:"Showing latest messages",
    })
   }
  } catch (error) {
  const axiosError=error as AxiosError<ApiResponse>
// ...existing code...
toast.error(
  axiosError.response?.data.message || "Failed to fetch messages",
  );
// ...existing code...
  }
  finally{
    setIsLoading(false);
    setIsSwichingLoading(false);
  }
}
  ,[setIsLoading,setMessages])

  useEffect(()=>{
    if(!session||!session.user){
      return
    }
    fetchMessages()
    fetchAcceptMessage()
  },[session,setValue,fetchAcceptMessage,fetchMessages])

  //handle switch change
  const handleSwitchChange=async()=>{
    try {
     const response= await axios.post<ApiResponse>('/api/accept-messages',{
     acceptMessages:!acceptMessage
      })
      setValue('acceptMessage',!acceptMessage)
      toast(response.data.message);
    } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
// ...existing code...
toast.error(
  axiosError.response?.data.message || "Failed to chanage the isAcceptingMessage state"
  );
    }
  }

    if(!session||!session.user){
    return <div>Please Login</div>
  }
  

 const {username}=session.user as User 
 const baseUrl=`${window.location.protocol}//${window.location.host}`
 const profileUrl=`${baseUrl}/u/${username}`;

 const copyToClipboard=()=>{
  navigator.clipboard.writeText(profileUrl);
  toast("URL copied",{
    description:"ProfileURL has been copid to the clipboard"
  })
 }

  return (
     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchingLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message,index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}