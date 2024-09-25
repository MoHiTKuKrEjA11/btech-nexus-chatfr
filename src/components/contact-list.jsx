import { useAppStore } from '@/store';
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';

const contactList = ({contacts,isChannel = false}) => {

    const {selectedChatData, selectedChatType , setSelectedChatData , setSelectedChatType,setSelectedChatMessages } = useAppStore();
    
    const handleClick = (contact) =>{
        if(isChannel) setSelectedChatType('channel')
        else setSelectedChatType('contact')
        setSelectedChatData(contact)

        // if(selectedChatData && selectedChatData._id === contact._id){
        //     setSelectedChatMessages([])
        // }
    }
    
    return (
        <div className='mt-5'>
            {
                contacts.map((contact)=>(
                    <div
                        key={contact._id}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && (selectedChatData._id === contact._id) ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]" }`}
                        onClick={()=>handleClick(contact)}
                    >
                        <div className="flex items-center justify-start gap-5 text-neutral-300">
                            {
                                !isChannel && (<Avatar className="w-10 h-10 overflow-hidden rounded-full">
                                    {
                                        contact.image ? (
                                            <AvatarImage
                                                src={`${HOST}/${contact.image}`}
                                                className="object-cover w-full h-full bg-black"
                                                alt="profile"
                                            />
                                        ):(
                                            <div className={`
                                                ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border-white/70 border" : `${getColor(contact.color)}`}
                                            uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}>
                                            {
                                                contact.firstName
                                                ? contact.firstName.split("").shift()
                                                : contact.email.split("").shift()
                                            }
                                        </div>
                                    )}
                                </Avatar>
                                )}
                                {isChannel && (<div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>)}
                                {isChannel ? <span>{contact.name}</span> : <span>{`${contact.firstName} ${contact.lastName}`}</span>}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default contactList;
