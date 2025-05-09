import React from 'react';
import { ChatCircleText, Swap } from '../../../theme/icons';
import { shiftTypeLabels } from '../../../utils/labelMaps';
import { getFriendlyDateParts } from '../../../utils/formatFriendlyDate';

const ChatCardContent = ({ otherPersonName, myDate, myType, otherDate, otherType }) => {
  const my = getFriendlyDateParts(myDate);
  const other = getFriendlyDateParts(otherDate);

  return (
    <div className="chat-card-content" style={{ padding: 0 }}>
      <div className="chat-line-row">
          <ChatCircleText size={20} weight="fill" />
        <span className="chat-name">Chat con {otherPersonName}</span>
      </div>

      <div className="chat-line-row" style={{ alignItems: 'flex-start' }}>
        <div style={{ width: 20, height: 20, flexShrink: 0, marginTop: '2px' }}>
          <Swap size={20} />
        </div>
        <span>
          Tú haces el {my.short} de {shiftTypeLabels[myType]} por {other.short} de {shiftTypeLabels[otherType]}
        </span>
      </div>
    </div>
  );
};

export default ChatCardContent;
