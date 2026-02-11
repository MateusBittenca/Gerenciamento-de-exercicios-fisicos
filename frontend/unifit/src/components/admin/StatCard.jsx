import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  variant = 'default' 
}) => {
  const variantColors = {
    default: 'var(--gray-400)',
    success: '#10b981',
    danger: 'var(--primary)',
    info: '#3b82f6',
    warning: '#f59e0b'
  };

  const iconColor = variantColors[variant] || variantColors.default;

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <div className="stat-card__icon" style={{ color: iconColor }}>
          <i className={`bi bi-${icon}`}></i>
        </div>
        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trend > 0 ? 'up' : 'down'}`}>
            <i className={`bi bi-arrow-${trend > 0 ? 'up' : 'down'}`}></i>
            <span>{Math.abs(trendValue)}%</span>
          </div>
        )}
      </div>
      <div className="stat-card__body">
        <h3 className="stat-card__value">{value}</h3>
        <p className="stat-card__title">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
