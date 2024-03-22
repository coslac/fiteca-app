
import { useMemo } from 'react'
import './styles.scss'

const VslInitials = ({ name }) => {

    const firstNameInital = useMemo(() => `${name.split(' ')[0]?.charAt(0)}`, [name])
    const lastNameInitial = useMemo(() => {
        return name.split(' ')[1] ? `${name.split(' ')[1]?.charAt(0)}` : ''
    }, [name])

    return (
        <div className='user-background'>
            {firstNameInital}{lastNameInitial}
        </div>
    )
}

export default VslInitials;