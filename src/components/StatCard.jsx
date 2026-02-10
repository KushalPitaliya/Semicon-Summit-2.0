import useCountUp from '../hooks/useCountUp';

const StatCard = ({ value, label }) => {
    const [ref, display] = useCountUp(value, 2500);

    return (
        <div ref={ref} className="stat-card">
            <span className="stat-value text-gradient">{display}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
};

export default StatCard;
