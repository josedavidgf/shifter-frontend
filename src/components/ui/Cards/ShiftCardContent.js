import React from 'react';
import { shiftTypeLabels, shiftTypeIcons } from '../../../utils/labelMaps';
import { Swap, UserFocus } from '../../../theme/icons'
import { getFriendlyDateParts } from '../../../utils/formatFriendlyDate';


const ShiftCardContent = ({ date, type, workerName, swapsAccepted }) => {
    const Icon = shiftTypeIcons[type];
    const { label, short } = getFriendlyDateParts(date);


    return (
        <div className="shift-card-content">
            {/* Top section */}
            <div className="shift-card-header">
                <div className="shift-date">
                    <div className="shift-icon" style={{ backgroundColor: `var(--shift-${type})` }}>
                        <Icon size={24} />
                    </div>
                    <div className="shift-date-text">
                        <strong>{label}</strong>
                        <div>{short}</div>
                    </div>


                </div>
                <div className="shift-type">{shiftTypeLabels[type]}</div>
            </div>

            {/* Middle */}
            <div className="shift-meta-row">
                <UserFocus size={20} />
                <span>{workerName}</span>
            </div>

            {/* Bottom */}
            <div className="shift-meta-row">
                <Swap size={20} />
                <span>Cambios aceptados: {swapsAccepted}</span>
            </div>
        </div>
    );
};

export default ShiftCardContent;
