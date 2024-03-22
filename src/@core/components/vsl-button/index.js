import { Button, Spinner } from "reactstrap";
import './styles.scss'

const OutButton = ({ loading, onClick, title, ...others }) => {
    return (
        <Button
            disabled={loading}
            color="primary"
            className="out-btn"
            onClick={onClick}
            {...others}
        >
            {
                loading && <Spinner className="out-spinner" color='white' size='sm' />
            }
            <span>
                {title}
            </span>
        </Button>
    )
}

export default OutButton;