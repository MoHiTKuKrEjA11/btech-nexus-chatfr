import { useAppStore } from '@/store'
import { useEffect, useRef, useState } from 'react';
import {apiClient} from '@/lib/api-client'
import moment from 'moment';
import { GET_ALL_MESSAGES_ROUTE } from '@/utils/constants';
import { HOST } from '@/utils/constants';
import { MdFolderZip} from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5'

const MessageContainer = () => {
    const scrollRef = useRef();
    const {selectedChatType,selectedChatData,userInfo,selectedChatMessages ,setSelectedChatMessages,setIsDownloading,setFileDownloadProgress} = useAppStore();

    const [showImage, setShowImage] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(()=>{
        const  getMessages = async() => {
            try{
                const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE,{id:selectedChatData._id},{withCredentials:true})
                console.log(response)
                if(response.data.messages){
                    setSelectedChatMessages(response.data.messages)
                }
            }catch(error){
                console.log({error})
            }
        }

        if(selectedChatData._id){
            if(selectedChatType === "contact") getMessages()
        }
    },[selectedChatData,selectedChatType,setSelectedChatMessages])

    useEffect(()=>{
        if(scrollRef.current){
            scrollRef.current.scrollIntoView({behavior:"smooth"})
        }
    },[selectedChatMessages])

    const checkIfImage = (filePath) => {
        const imageRegex =/\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath)
    }

    const renderMessages = () => {
        let lastDate = null;
        return selectedChatMessages.map((message,index)=>{
            const messageDate = moment(message.timestamp).format("DD-MM-YYYY");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate
            return(
                <div key={index}>
                    {
                        showDate && (
                        <div className='my-2 text-center text-gray-500'>
                            {moment(message.timestamp).format("LL")}
                        </div>
                    )}
                    {
                        selectedChatType === 'contact' && renderDMMessages(message)
                    }
                </div>
            )
        })
    }

    const downloadFile = async(url) => {
        setIsDownloading(true)
        setFileDownloadProgress(0)
        const response = await apiClient.get(`${HOST}/${url}`,{
            responseType:"blob",
            onDownloadProgress:(progressEvent)=>{
                const {loaded,total} = progressEvent;
                const percentCompleted = Math.round((loaded * 100) / total);
                setFileDownloadProgress(percentCompleted)
            }
        })
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = urlBlob;
        link.setAttribute('download',url.split('/').pop())
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(urlBlob)
        setIsDownloading(false)
        setFileDownloadProgress(0)
    }

    const renderDMMessages = (message) =>(
        <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
            {
                message.messageType === "text" && (
                    <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :"bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                        {message.content}
                    </div>
                )}
                {
                    message.messageType === "file" && (
                        <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :"bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                            {checkIfImage(message.fileUrl) ? (
                                <div
                                    className='cursor-pointer'
                                    onClick={() => {
                                        setShowImage(true)
                                        setImageUrl(message.fileUrl)
                                    }}
                                >
                                    <img src={`${HOST}/${message.fileUrl}`} height={300} width={300}/>
                                </div>
                            ) :(
                                <div className='flex items-center justify-center gap-5'>
                                    <span className='p-3 text-3xl rounded-full bg-black/20 text-white/80 '>
                                        <MdFolderZip />
                                    </span>
                                    <span>{message.fileUrl.split('/').pop()}</span>
                                    <span
                                        className='p-3 text-2xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50'
                                        onClick={()=>downloadFile(message.fileUrl)}
                                    >
                                        <IoMdArrowRoundDown />
                                    </span>
                                </div>
                                )}
                        </div>
                    )
                }
                <div className='text-xs text-gray-600'>
                    {moment(message.timestamp).format("LT")}
                </div>
        </div>
    )

  return (
    <div className="flex-1 p-4 px-8 overflow-y-auto scrollbar-hidden md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
        {renderMessages()}
        <div ref={scrollRef} />
        {
            showImage && (
                <div className='fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col'>
                    <div>
                        <img
                            src={`${HOST}/${imageUrl}`}
                            className='h-[80vh] w-full bg-cover'
                        />
                    </div>
                    <div className='fixed top-0 flex gap-5 mt-5'>
                        <button
                            className='p-3 text-2xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50'
                            onClick={()=>downloadFile(imageUrl)}
                        >
                            <IoMdArrowRoundDown />
                        </button>
                        <button
                            className='p-3 text-2xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50'
                            onClick={()=>{
                                setShowImage(false)
                                setImageUrl(null)
                            }}
                        >
                            <IoCloseSharp />
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default MessageContainer
