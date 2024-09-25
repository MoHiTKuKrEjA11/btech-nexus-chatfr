import { Avatar , AvatarImage} from '@/components/ui/avatar';
import { useAppStore } from '@/store';
import { getColor } from '@/lib/utils';
import { HOST , LOGOUT_ROUTE } from '@/utils/constants';
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger} from "@/components/ui/tooltip"
import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5'
import { apiClient } from '@/lib/api-client';

const ProfileInfo = () => {
    const {userInfo , setUserInfo} = useAppStore();
    const navigate = useNavigate();

    const logOut = async() => {
        try{
            const response = await apiClient.post(
                LOGOUT_ROUTE,
                {},
                {withCredentials:true}
            );
            if(response.status === 200){
                navigate('/auth');
                setUserInfo(null);
            }
        }catch(error){
            console.log({error});
        }
    }

    return (
    <div className="absolute bottom-0 flex items-center justify-between w-full h-16 px-10 bg-[#2a2b33]">
        <div className="flex items-center justify-center gap-3">
            <div className='relative w-12 h-12'>
                <Avatar className="w-12 h-12 overflow-hidden rounded-full">
                            {
                                userInfo.image ? (
                                    <AvatarImage
                                        src={`${HOST}/${userInfo.image}`}
                                        className="object-cover w-full h-full bg-black"
                                        alt="profile"
                                    />
                                ):(
                                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)} `}>
                                    {
                                        userInfo.firstName
                                        ? userInfo.firstName.split("").shift()
                                        : userInfo.email.split("").shift()
                                    }
                                </div>
                            )}
                </Avatar>
            </div>
            <div className='lato-regular'>
                {
                    userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                }
            </div>
        </div>
        <div className="flex gap-5">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FiEdit2
                            className="text-xl font-medium text-purple-500"
                            onClick={() => navigate('/profile')}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                        <p>Edit Profile</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <IoPowerSharp
                            className="text-xl font-medium text-red-500"
                            onClick={logOut}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                        <p>Logout</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </div>
  )
}

export default ProfileInfo
