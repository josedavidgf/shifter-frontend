import React from 'react';
import { Swap } from '../../../theme/icons';
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
                <div className='swap-icon-wrapper'>
                    <Swap size={20} />
                </div>
                <span>Cambio con {otherPersonName}</span>
            </div>

            <div className="swap-line-row">
                <div className='swap-icon-wrapper-secondary'>
                    <Swap size={20} />
                </div>
                <span>
                    Tú haces el {myDateParts.short} ({shiftTypeLabels[myType]}) por {otherDateParts.short} ({shiftTypeLabels[otherType]})
                </span>
            </div>
        </div>
    );
};

export default SwapCardContent;
