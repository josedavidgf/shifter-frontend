import React from 'react';
import { Swap, UserFocus } from '../../../theme/icons';
import { shiftTypeLabels } from '../../../utils/labelMaps';
import { getFriendlyDateParts } from '../../../utils/formatFriendlyDate';
import { swapStatusTags } from '../../../utils/labelMaps';

const SwapCardContent = ({
    otherPersonName,
    myDate,
    myType,
    otherDate,
    otherType,
    statusLabel
}) => {

    const myDateParts = getFriendlyDateParts(myDate);
    const otherDateParts = getFriendlyDateParts(otherDate);

    return (
        <div className="swap-card-content">
            <div className={`tag tag--${statusLabel}`}>
                <span className="tag__label">{swapStatusTags[statusLabel]}</span>
            </div>
            <div className="swap-line-row">
                <UserFocus size={20} />
                <span>Cambio con {otherPersonName}</span>
            </div>

            <div className="swap-line-row" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, flexShrink: 0, marginTop: '2px' }}>
                    <Swap size={20} />
                </div>
                <span>
                    Tú haces el {otherDateParts.short} de {shiftTypeLabels[otherType]} por el {myDateParts.short} de {shiftTypeLabels[myType]}
                </span>
            </div>
        </div>
    );
};

export default SwapCardContent;
