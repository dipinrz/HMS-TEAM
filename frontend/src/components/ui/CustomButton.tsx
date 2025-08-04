import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps{
    label:string;
}

const CustomButton:React.FC<CustomButtonProps>=({label,variant='contained', color='primary',...props})=>{
    return(
        <Button variant={variant} color={color} {...props}>
            {label}
        </Button>
    );
}
export default CustomButton;