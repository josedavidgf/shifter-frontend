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
        <div className="chat-icon-wrapper">
          <ChatCircleText size={20} />
        </div>
        <span className="chat-name">Chat con {otherPersonName}</span>
      </div>

      <div className="chat-line-row">
        <div className="chat-icon-wrapper">
          <Swap size={20} />
        </div>
        <span>
          Tú haces el {my.short} ({shiftTypeLabels[myType]}) por {other.short} ({shiftTypeLabels[otherType]})
        </span>
      </div>
    </div>
  );
};

export default ChatCardContent;
