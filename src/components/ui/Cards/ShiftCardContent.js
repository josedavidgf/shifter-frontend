import React from 'react';
import { shiftTypeLabels, shiftTypeIcons } from '../../../utils/labelMaps';
import { Swap, UserFocus, Fire } from 'phosphor-react'
import { getFriendlyDateParts } from '../../../utils/formatFriendlyDate';
import { format, addDays, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';


const ShiftCardContent = ({ date, type, workerName, swapsAccepted }) => {
    const Icon = type === 'reinforcement' ? Fire : shiftTypeIcons[type];
    const { label, short } = getFriendlyDateParts(date);

   // const labelToUse = label === 'Mañana' ? format(addDays(new Date(), 1), 'EEEE', { locale: es }) : label;


    return (
        <div className="shift-card-content">
            {/* Top section */}
            <div className="shift-card-header">
                <div className="shift-date">
                    <div className="shift-icon" style={{ backgroundColor: `var(--shift-${type})` }}>
                        <Icon size={24} weight="fill" />
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
                <UserFocus size={20} weight="fill" />
                <span>{workerName}</span>
            </div>

            {/* Bottom */}
            <div className="shift-meta-row">
                <Swap size={20} weight="fill" />
                <span>Cambios aceptados: {swapsAccepted}</span>
            </div>
        </div>
    );
};

export default ShiftCardContent;
