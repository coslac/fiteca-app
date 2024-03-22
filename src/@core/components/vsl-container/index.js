import { Row, Spinner } from "reactstrap";
import './vsl-container.scss'


const VslContainer = ({ children, loading = false, loadingContainerClassName }) => {
    return (
        <>
            {
                loading ? (
                    <div className={`loading-container ${loadingContainerClassName}`}>
                        <Spinner className="text-purple-400" />
                    </div >
                ) : (
                    <>
                        {children}
                    </>
                )
            }
        </>
    )
}

export default VslContainer;