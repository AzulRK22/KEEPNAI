import dynamic from 'next/dynamic';

const WaypointMap = dynamic(() => import('./WaypointMap'), {
  ssr: false,
});

const WaypointMapWrapper = () => {
  return <WaypointMap />;
};

export default WaypointMapWrapper;