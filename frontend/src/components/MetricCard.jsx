import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, type, className = '' }) => {
    let valueColorClass = '';
    if (type === 'blue') valueColorClass = 'val-x';
    if (type === 'purple') valueColorClass = 'val-y';
    if (type === 'white') valueColorClass = 'val-z';

    return (
        <motion.div
            className={`glass-panel metric-mini ${className}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <div className="metric-label">{title}</div>
            <div className={`metric-value ${valueColorClass}`}>
                {value}
            </div>
        </motion.div>
    );
};

export default MetricCard;
