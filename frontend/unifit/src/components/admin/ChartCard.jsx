import React from 'react';

const ChartCard = ({ 
  title, 
  subtitle, 
  children,
  actions
}) => {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div className="chart-card__title-wrapper">
          <h3 className="chart-card__title">{title}</h3>
          {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
        </div>
        {actions && (
          <div className="chart-card__actions">
            {actions}
          </div>
        )}
      </div>
      <div className="chart-card__body">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
