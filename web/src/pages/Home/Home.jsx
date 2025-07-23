import { useAtom } from 'jotai';
import { viewModeAtom } from '../../atoms/uiAtoms';

import { Link } from 'react-router-dom';
import Event from '../Event/Event';

const Home = () => {
    const [viewMode] = useAtom(viewModeAtom);

    return(
        <div>
            {viewMode === "event" ? (
                <div>
                    <Link to={"/event"}>Event create</Link>
                </div>
                
            ) : (
                <div>Experience</div>
            )}
        </div>
    );
};

export default Home;